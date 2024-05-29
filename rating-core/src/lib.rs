use chrono::{DateTime, Local};
use once_cell::sync::Lazy;
use ordered_float::OrderedFloat;
use serde::{Deserialize, Serialize};
use std::collections::BinaryHeap;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct RawContestResult {
    pub is_rated: bool,
    pub place: u32,
    pub performance: i32,
    pub contest_name: String,
    pub end_time: DateTime<Local>,
    pub user_screen_name: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContestResult {
    pub contest_name: String,
    pub is_long_term: bool,
    pub end_time: DateTime<Local>,
    pub results: Vec<IndividualResult>,
}

impl ContestResult {
    pub fn new(
        contest_name: String,
        is_long_term: bool,
        end_time: DateTime<Local>,
        results: Vec<IndividualResult>,
    ) -> Self {
        Self {
            contest_name,
            is_long_term,
            end_time,
            results,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IndividualResult {
    pub is_rated: bool,
    pub place: u32,
    pub performance: i32,
    pub user_screen_name: String,
}

impl IndividualResult {
    pub fn new(is_rated: bool, place: u32, performance: i32, user_screen_name: String) -> Self {
        Self {
            is_rated,
            place,
            performance,
            user_screen_name,
        }
    }
}

static LOG_TABLE: Lazy<Vec<f64>> = Lazy::new(|| (0..=101).map(|i| (i as f64).ln()).collect());
const S: f64 = 724.4744301;
const R: f64 = 0.8271973364;

pub fn calc_rating(performances: &[i32]) -> u32 {
    if performances.is_empty() {
        return 0;
    }

    let mut queue = BinaryHeap::with_capacity(performances.len());
    let mut attenuations = vec![1; performances.len()];

    for (i, &performance) in performances.iter().enumerate() {
        queue.push((OrderedFloat(calc_q(performance, 1)), i));
    }

    let mut qr = 0.0;
    let mut current_r = 1.0;
    let mut sum_r = 0.0;

    for _ in 0..100 {
        let (OrderedFloat(q), i) = queue.pop().expect("performance queue is empty");
        current_r *= R;
        sum_r += current_r;
        qr += current_r * q;
        attenuations[i] += 1;

        let q = calc_q(performances[i], attenuations[i]);
        queue.push((OrderedFloat(q), i));
    }

    let r = qr / sum_r;

    let rating = if r >= 400.0 {
        r
    } else {
        400.0 / ((400.0 - r) / 400.0).exp()
    };

    rating.round() as u32
}

fn calc_q(performance: i32, attenuation: u32) -> f64 {
    performance as f64 - S * LOG_TABLE[attenuation as usize]
}

// calculate gp30 according to https://atcoder.jp/posts/170
pub fn calc_gp30(rank: u32) -> u32 {
    if rank > 30 {
        0
    } else if rank >= 15 {
        16 - (rank - 15)
    } else if rank >= 10 {
        26 - 2 * (rank - 10)
    } else {
        match rank {
            1 => 100,
            2 => 75,
            3 => 60,
            4 => 50,
            5 => 45,
            6 => 40,
            7 => 36,
            8 => 32,
            9 => 29,
            _ => 0,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn calc_rating_normal_test() {
        let performances = [
            2410, 1603, 2521, 2633, 1669, 2126, 2402, 2488, 2484, 3068, 3482, 1763, 2655, 2708,
            2475, 3015, 1821, 2898, 2204, 2414, 2068, 2233, 2074, 3351, 2433, 1890, 2283, 2836,
            1370, 3475, 2963, 3279,
        ];
        let ratings = [
            1410, 1505, 1865, 2097, 2106, 2146, 2215, 2280, 2329, 2512, 2797, 2797, 2816, 2836,
            2840, 2890, 2890, 2918, 2919, 2920, 2920, 2920, 2920, 3016, 3017, 3017, 3017, 3028,
            3028, 3123, 3134, 3175,
        ];

        for i in 1..=performances.len() {
            let rating = calc_rating(&performances[..i]);
            assert_eq!(rating, ratings[i - 1]);
        }
    }

    #[test]
    fn calc_rating_under_400_test() {
        let performances = [467];
        let rating = calc_rating(&performances);
        assert_eq!(rating, 39);
    }

    #[test]
    fn calc_gp30_score() {
        assert_eq!(calc_gp30(1), 100);
        assert_eq!(calc_gp30(15), 16);
        assert_eq!(calc_gp30(12), 22);
        assert_eq!(calc_gp30(20), 11);
        assert_eq!(calc_gp30(30), 1);
    }
}
