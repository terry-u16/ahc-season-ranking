mod utils;

use anyhow::{bail, Result};
use chrono::{DateTime, Local};
use itertools::Itertools;
use rating_core::{calc_rating, ContestResult};
use serde::{Deserialize, Serialize};
use std::cmp::Reverse;
use wasm_bindgen::prelude::*;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Input {
    pub contest_results: Vec<ContestResult>,
    pub since: DateTime<Local>,
    pub until: DateTime<Local>,
    pub include_short: bool,
    pub include_long: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Output {
    pub users: Vec<User>,
    pub error: String,
}

impl Output {
    pub fn new(users: Vec<User>, error: String) -> Self {
        Self { users, error }
    }
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub rating: u32,
    pub rank: u32,
    pub user_screen_name: String,
}

impl User {
    pub fn new(rating: u32, rank: u32, user_screen_name: String) -> Self {
        Self {
            rating,
            rank,
            user_screen_name,
        }
    }
}

#[wasm_bindgen]
pub fn calc_ratings(input: JsValue) -> JsValue {
    match calc_ratings_inner(input) {
        Ok(result) => serde_wasm_bindgen::to_value(&Output::new(result, "".to_string())).unwrap(),
        Err(err) => serde_wasm_bindgen::to_value(&Output::new(vec![], err.to_string())).unwrap(),
    }
}

fn calc_ratings_inner(input: JsValue) -> Result<Vec<User>> {
    let input: Input = match serde_wasm_bindgen::from_value(input) {
        Ok(input) => input,
        Err(_) => {
            bail!("入力の読み込み中にエラーが発生しました。")
        }
    };

    Ok(calc_all_ratings(&input))
}

fn calc_all_ratings(input: &Input) -> Vec<User> {
    let grouped_results = input
        .contest_results
        .iter()
        .filter(|c| {
            (c.is_long_term && input.include_long) || (!c.is_long_term && input.include_short)
        })
        .filter(|c| input.since <= c.end_time && c.end_time <= input.until)
        .flat_map(|c| c.results.iter().filter(|r| r.is_rated))
        .into_group_map_by(|r| r.user_screen_name.as_str());

    let users = grouped_results
        .into_iter()
        .map(|(name, result)| {
            let performances = result.iter().map(|r| r.performance).collect_vec();
            let rating = calc_rating(&performances);
            (rating, name)
        })
        .sorted_by_key(|&(rating, name)| (Reverse(rating), name));

    let mut rank = 1;
    let mut user_with_ranking = vec![];
    let mut prev_rating = u32::MAX;

    for (i, (rating, name)) in users.enumerate() {
        if rating != prev_rating {
            rank = i + 1;
        }

        user_with_ranking.push(User::new(rating, rank as u32, name.to_string()));
        prev_rating = rating;
    }

    user_with_ranking
}
