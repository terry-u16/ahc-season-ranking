use anyhow::{Context, Result};
use clap::Parser;
use rating_core::{ContestResult, RawContestResult};
use std::{
    fs,
    path::{Path, PathBuf},
};

#[derive(Debug, Parser)]
#[clap(
    name = "crawler",
    version = "0.1.0",
    author = "terry_u16",
    about = "Performance crawler for AtCoder contests"
)]
struct Args {
    /// contest name (e.g. ahc001)
    #[clap(short, long)]
    contest: String,
    /// path to the JSON file to save the results
    #[clap(short, long, default_value = "./web/public/contest_results.json")]
    json_path: PathBuf,
}

fn main() -> Result<()> {
    let args = Args::parse();
    let results = fetch_contest_result(&args.contest).context("failed to fetch contest results")?;
    save_contest_results(results, &args.json_path).context("failed to save contest results")?;

    Ok(())
}

fn fetch_contest_result(contest: &str) -> Result<ContestResult> {
    let url = format!("https://atcoder.jp/contests/{}/results/json", contest);
    let response = reqwest::blocking::get(url)?.error_for_status()?;
    let results: Vec<RawContestResult> = serde_json::from_str(&response.text()?)?;

    let contest_name = results
        .iter()
        .map(|r| r.contest_name.to_string())
        .next()
        .context("no record found")?;
    let end_time = results
        .iter()
        .map(|r| r.end_time)
        .next()
        .context("no record found")?;
    let results = results
        .into_iter()
        .map(|r| {
            rating_core::IndividualResult::new(
                r.is_rated,
                r.place,
                r.performance,
                r.user_screen_name,
            )
        })
        .collect();
    let result = rating_core::ContestResult::new(contest_name, end_time, results);

    Ok(result)
}

fn save_contest_results(new_results: ContestResult, path: &Path) -> Result<()> {
    let mut results: Vec<ContestResult> = match std::fs::read_to_string(path) {
        Ok(s) => serde_json::from_str(&s)?,
        Err(_) => vec![],
    };

    results.retain(|r| &r.contest_name != &new_results.contest_name);
    results.push(new_results);
    results.sort_unstable_by_key(|r| r.end_time);

    fs::create_dir_all(
        path.parent()
            .context("given path does not have parent directory")?,
    )?;

    let json = serde_json::to_string(&results)?;
    std::fs::write(path, json)?;

    Ok(())
}
