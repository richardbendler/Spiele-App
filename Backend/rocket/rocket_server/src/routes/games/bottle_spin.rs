use rocket::serde::json::Json;
use rocket::State;
use sqlx::{MySql, Pool};

use crate::routes::games::common::*;


//TODO: logic is currently copied from the_one.rs, generic implementation in the future would be good for maintanance
// define routes
#[get("/bottleSpinTruth")]
pub async fn query_truth(pool: &State<Pool<MySql>>, _key: AppKey<'_>) -> Json<Response<ClassicGamesResult>> {
    let unwraped_pool = pool.inner();
    let results: Vec<ClassicGamesResult> = sqlx::query_as!(
        ClassicGamesResultWithOptions,
        "SELECT 
            game_klassiker_questions.id AS question_id,
            game_klassiker_questions.fk_pool AS fk_pool,
            game_klassiker_questions.content AS content,
            game_klassiker_questions.drunk_level AS drunk_level,
            game_klassiker_questions.exposure_level AS exposure_level,
            game_klassiker_questions.bool_drink AS bool_drink,
            game_klassiker_questions.activation AS activation,
            game_klassiker_questions.author AS author,
            game_klassiker_questions.popularity AS popularity,
            game_klassiker_questions.timestamp AS timestamp,
            game_klassiker_pools.id AS pool_id,
            game_klassiker_pools.fk_game AS pool_fk_game,
            game_klassiker_pools.name AS pool_name,
            game_klassiker_pools.comment AS pool_comment,
            game_klassiker_pools.color AS pool_color
        FROM 
            `game_klassiker_questions` 
        INNER JOIN 
            `game_klassiker_pools` 
        ON 
            `game_klassiker_questions`.fk_pool=`game_klassiker_pools`.id
        WHERE 
            fk_pool = 2"
    )
    .fetch_all(unwraped_pool)
    .await
    .expect("Query for spin the bottle (truth) was successully executed")
    .iter()
    .map(|entry| {
        // create new QueryResult instance
        let mut unwraped_entry = ClassicGamesResult {
            question_id: entry.question_id,
            fk_pool: entry.fk_pool,
            content: String::new(),
            drunk_level: entry.drunk_level,
            exposure_level: entry.exposure_level,
            bool_drink: entry.bool_drink,
            activation: entry.activation,
            author: String::new(),
            popularity: entry.popularity,
            timestamp: entry.timestamp.unix_timestamp(),
            pool_id: entry.pool_id,
            pool_fk_game: entry.pool_fk_game,
            pool_name: String::new(),
            pool_comment: String::new(),
            pool_color: String::new(),
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
pub async fn query_dare(pool: &State<Pool<MySql>>, _key: AppKey<'_>) -> Json<Response<ClassicGamesResult>> {
    let unwraped_pool = pool.inner();
    let results: Vec<ClassicGamesResult> = sqlx::query_as!(
        ClassicGamesResultWithOptions,
        "SELECT 
            game_klassiker_questions.id AS question_id,
            game_klassiker_questions.fk_pool AS fk_pool,
            game_klassiker_questions.content AS content,
            game_klassiker_questions.drunk_level AS drunk_level,
            game_klassiker_questions.exposure_level AS exposure_level,
            game_klassiker_questions.bool_drink AS bool_drink,
            game_klassiker_questions.activation AS activation,
            game_klassiker_questions.author AS author,
            game_klassiker_questions.popularity AS popularity,
            game_klassiker_questions.timestamp AS timestamp,
            game_klassiker_pools.id AS pool_id,
            game_klassiker_pools.fk_game AS pool_fk_game,
            game_klassiker_pools.name AS pool_name,
            game_klassiker_pools.comment AS pool_comment,
            game_klassiker_pools.color AS pool_color
        FROM 
            `game_klassiker_questions` 
        INNER JOIN 
            `game_klassiker_pools` 
        ON 
            `game_klassiker_questions`.fk_pool=`game_klassiker_pools`.id
        WHERE 
            fk_pool = 3"
    )
    .fetch_all(unwraped_pool)
    .await
    .expect("Query for spin the bottle (dare) was successully executed")
    .iter()
    .map(|entry| {
        // create new QueryResult instance
        let mut unwraped_entry = ClassicGamesResult {
            question_id: entry.question_id,
            fk_pool: entry.fk_pool,
            content: String::new(),
            drunk_level: entry.drunk_level,
            exposure_level: entry.exposure_level,
            bool_drink: entry.bool_drink,
            activation: entry.activation,
            author: String::new(),
            popularity: entry.popularity,
            timestamp: entry.timestamp.unix_timestamp(),
            pool_id: entry.pool_id,
            pool_fk_game: entry.pool_fk_game,
            pool_name: String::new(),
            pool_comment: String::new(),
            pool_color: String::new(),
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
