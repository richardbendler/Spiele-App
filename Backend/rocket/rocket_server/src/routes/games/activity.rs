use rocket::serde::json::Json;
use rocket::time::OffsetDateTime;
use rocket::State;
use serde::Serialize;
use sqlx::{MySql, Pool};

use crate::routes::games::common::*;


// definition of data schema
pub struct ActivityResultWithOptions {
    id: i32,
    word: Option<String>,
    forbidden_words: Option<String>,
    category: Option<String>,
    fk_difficulty: i32,
    popularity: i32,
    timestamp: OffsetDateTime
}

#[derive(Serialize)]
pub struct ActivityResult {
    id: i32,
    word: String,
    forbidden_words: String,
    category: String,
    fk_difficulty: i32,
    popularity: i32,
    timestamp: i64
}



//TODO: logic is partially copied from the_one.rs, however the dataschema is different (important for later refacturing)
// define routes
#[get("/activity")]
pub async fn query(pool: &State<Pool<MySql>>, _key: AppKey<'_>) -> Json<Response<ActivityResult>> {
    let unwraped_pool = pool.inner();
    let results: Vec<ActivityResult> = sqlx::query_as!(
        ActivityResultWithOptions,
        "SELECT * FROM `game_activity_words`"
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