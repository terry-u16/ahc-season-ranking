use std::{
    fs,
    path::{Path, PathBuf},
};

use anyhow::{Context, Result};
use clap::Parser;
use itertools::Itertools;
use rating_core::ContestResult;

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
    save_contest_results(&results, &args.json_path).context("failed to save contest results")?;

    Ok(())
}

fn fetch_contest_result(contest: &str) -> Result<Vec<ContestResult>> {
    let url = format!("https://atcoder.jp/contests/{}/results/json", contest);
    let response = reqwest::blocking::get(url)?.error_for_status()?;
    let results: Vec<ContestResult> = serde_json::from_str(&response.text()?)?;
    Ok(results)
}

fn save_contest_results(results: &[ContestResult], path: &Path) -> Result<()> {
    let mut saved_results: Vec<ContestResult> = match std::fs::read_to_string(path) {
        Ok(s) => serde_json::from_str(&s)?,
        Err(_) => vec![],
    };

    for name in results.iter().map(|r| &r.contest_name).unique() {
        saved_results.retain(|r| &r.contest_name != name);
    }

    fs::create_dir_all(
        path.parent()
            .context("given path does not have parent directory")?,
    )?;

    let json = serde_json::to_string_pretty(results)?;
    std::fs::write(path, json)?;

    Ok(())
}
