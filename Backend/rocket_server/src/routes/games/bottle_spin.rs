use rocket::serde::json::Json;
use rocket::State;
use sqlx::{MySql, Pool};

use crate::routes::games::common::*;


//TODO: logic is currently copied from the_one.rs, generic implementation in the future would be good for maintanance
// define routes
#[get("/bottleSpinTruth")]
pub async fn query_truth(pool: &State<Pool<MySql>>) -> Json<Response<ClassicGamesResult>> {
    let unwraped_pool = pool.inner();
    let results: Vec<ClassicGamesResult> = sqlx::query_as!(
        ClassicGamesResultWithOptions,
        "SELECT * FROM `game_klassiker_questions` WHERE fk_pool = 2"
    )
    .fetch_all(unwraped_pool)
    .await
    .expect("Query for spin the bottle (truth) was successully executed")
    .iter()
    .map(|entry| {
        // create new QueryResult instance
        let mut unwraped_entry = ClassicGamesResult {
            id: entry.id,
            fk_pool: entry.fk_pool,
            content: String::new(),
            drunk_level: entry.drunk_level,
            exposure_level: entry.exposure_level,
            bool_drink: entry.bool_drink,
            activation: entry.activation,
            author: String::new(),
            timestamp: entry.timestamp.unix_timestamp(),
        };
        // extract content values from Option
        match &entry.content {
            Some(x) => unwraped_entry.content = x.clone(),
            None => unwraped_entry.content = String::from(""),
        }
        // extract author from Option
        match &entry.author {
            Some(x) => unwraped_entry.author = x.clone(),
            None => unwraped_entry.author = String::from(""),
        }
        // return unwraped values
        unwraped_entry
    })
    .collect();

    Json(Response { content: results })
}

#[get("/bottleSpinDare")]
pub async fn query_dare(pool: &State<Pool<MySql>>) -> Json<Response<ClassicGamesResult>> {
    let unwraped_pool = pool.inner();
    let results: Vec<ClassicGamesResult> = sqlx::query_as!(
        ClassicGamesResultWithOptions,
        "SELECT * FROM `game_klassiker_questions` WHERE fk_pool = 3"
    )
    .fetch_all(unwraped_pool)
    .await
    .expect("Query for spin the bottle (dare) was successully executed")
    .iter()
    .map(|entry| {
        // create new QueryResult instance
        let mut unwraped_entry = ClassicGamesResult {
            id: entry.id,
            fk_pool: entry.fk_pool,
            content: String::new(),
            drunk_level: entry.drunk_level,
            exposure_level: entry.exposure_level,
            bool_drink: entry.bool_drink,
            activation: entry.activation,
            author: String::new(),
            timestamp: entry.timestamp.unix_timestamp(),
        };
        // extract content values from Option
        match &entry.content {
            Some(x) => unwraped_entry.content = x.clone(),
            None => unwraped_entry.content = String::from(""),
        }
        // extract author from Option
        match &entry.author {
            Some(x) => unwraped_entry.author = x.clone(),
            None => unwraped_entry.author = String::from(""),
        }
        // return unwraped values
        unwraped_entry
    })
    .collect();

    Json(Response { content: results })
}
