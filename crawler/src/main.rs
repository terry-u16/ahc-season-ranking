use anyhow::{Context, Result};
use clap::{Args, Parser};
use comfy_table::Table;
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
struct Cli {
    /// contest name (e.g. ahc001)
    #[clap(short, long)]
    contest: String,
    #[command(flatten)]
    term: Term,
    /// path to the JSON file to save the results
    #[clap(short, long, default_value = "./web/public/contest_results.json")]
    json_path: PathBuf,
}

#[derive(Debug, Args)]
#[group(required = true, multiple = false)]
struct Term {
    /// short term contest
    #[arg(short, long)]
    short: bool,
    /// long term contest
    #[arg(short, long)]
    long: bool,
}

fn main() -> Result<()> {
    let args = Cli::parse();

    // 順位表の提出時間から長期・短期の識別を行おうとしたが、ログインしないと見られないためCLIで受け取る形に
    let results = fetch_contest_result(&args.contest, args.term.long)
        .context("failed to fetch contest results")?;
    save_contest_results(results, &args.json_path).context("failed to save contest results")?;

    Ok(())
}

fn fetch_contest_result(contest: &str, is_long_term: bool) -> Result<ContestResult> {
    let results = fetch_results(contest)?;

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
    let result = rating_core::ContestResult::new(contest_name, is_long_term, end_time, results);

    Ok(result)
}

fn fetch_results(contest: &str) -> Result<Vec<RawContestResult>, anyhow::Error> {
    let url = format!("https://atcoder.jp/contests/{}/results/json", contest);
    let response = reqwest::blocking::get(url)?.error_for_status()?;
    let results: Vec<RawContestResult> = serde_json::from_str(&response.text()?)?;
    Ok(results)
}

fn save_contest_results(new_results: ContestResult, path: &Path) -> Result<()> {
    let mut results: Vec<ContestResult> = match std::fs::read_to_string(path) {
        Ok(s) => serde_json::from_str(&s)?,
        Err(_) => vec![],
    };

    results.retain(|r| &r.contest_name != &new_results.contest_name);
    results.push(new_results);
    results.sort_unstable_by_key(|r| r.end_time);
    show_contest_table(&results);

    fs::create_dir_all(
        path.parent()
            .context("given path does not have parent directory")?,
    )?;

    let json = serde_json::to_string(&results)?;
    std::fs::write(path, json)?;

    Ok(())
}

fn show_contest_table(results: &[ContestResult]) {
    let mut table = Table::new();
    table
        .set_header(["No.", "Contest Name", "Term"])
        .add_rows(results.iter().enumerate().map(|(i, r)| {
            [
                (i + 1).to_string(),
                r.contest_name.to_string(),
                if r.is_long_term { "Long" } else { "Short" }.to_string(),
            ]
        }));

    println!("{}", table);
}
