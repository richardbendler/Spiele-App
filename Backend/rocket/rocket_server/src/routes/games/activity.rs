use rocket::serde::json::Json;
use rocket::time::OffsetDateTime;
use rocket::State;
use serde::Serialize;
use sqlx::{MySql, Pool};

use crate::routes::games::common::*;


// definition of data schema
pub struct ActivityResultWithOptions {
    pub id: i32,
    pub word: Option<String>,
    pub forbidden_words: Option<String>,
    pub deletion: i32,
    pub activation: i32,
    pub category: Option<String>,
    pub fk_difficulty: i32,
    pub popularity: i32,
    pub timestamp: OffsetDateTime
}

#[derive(Serialize)]
pub struct ActivityResult {
    pub id: i32,
    pub word: String,
    pub forbidden_words: String,
    pub deletion: i32,
    pub activation: i32,
    pub category: String,
    pub fk_difficulty: i32,
    pub popularity: i32,
    pub timestamp: i64
}



//TODO: logic is partially copied from the_one.rs, however the dataschema is different (important for later refacturing)
// define routes
#[get("/activity")]
pub async fn query(pool: &State<Pool<MySql>>, _key: AppKey<'_>) -> Json<Response<ActivityResult>> {
    let unwraped_pool = pool.inner();
    let results: Vec<ActivityResult> = sqlx::query_as!(
        ActivityResultWithOptions,
        "SELECT 
            game_activity_words.id as id,
            game_activity_words.word as word,
            game_activity_words.forbidden_words as forbidden_words,
            game_activity_words.deletion as deletion,
            game_activity_words.activation as activation,
            game_activity_words.category as category,
            game_activity_words.fk_difficulty as fk_difficulty,
            game_activity_words.popularity as popularity,
            game_activity_words.timestamp as timestamp
         FROM 
            `game_activity_words` 
        WHERE 
            game_activity_words.deletion = 0 
            AND game_activity_words.activation = 1"
    )
    .fetch_all(unwraped_pool)
    .await
    .expect("Query for Activity was successully executed")
    .iter()
    .map(|entry| {
        // create new QueryResult instance
        let mut unwraped_entry = ActivityResult {
            id: entry.id,
            word: String::new(),
            forbidden_words: String::new(),
            deletion: entry.deletion,
            activation: entry.activation,
            category: String::new(),
            fk_difficulty: entry.fk_difficulty,
            popularity: entry.popularity,
            timestamp: entry.timestamp.unix_timestamp(),
        };
        // extract word from Option
        match &entry.word {
            Some(x) => unwraped_entry.word = x.clone(),
            None => unwraped_entry.word = String::from(""),
        }
        // extract forbidden words from Option
        match &entry.forbidden_words {
            Some(x) => unwraped_entry.forbidden_words = x.clone(),
            None => unwraped_entry.forbidden_words = String::from(""),
        }
        // extract forbidden words from Option
        match &entry.category {
            Some(x) => unwraped_entry.category = x.clone(),
            None => unwraped_entry.category = String::from(""),
        }

        // return unwraped values
        unwraped_entry
    })
    .collect();

    Json(Response { content: results })
}