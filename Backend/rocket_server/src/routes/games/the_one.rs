
use rocket::serde::json::Json;
use rocket::{time::OffsetDateTime, State};
use serde::Serialize;
use sqlx::{MySql, Pool};

use crate::routes::games::common::Response;

struct TheOneResultWithOptions {
    id: i32,
    fk_pool: i32,
    content: Option<String>,
    drunk_level: i32,
    exposure_level: i32,
    bool_drink: i32,
    activation: i32,
    author: Option<String>,
    timestamp: OffsetDateTime,
}

// defines result from db query without Options
#[derive(Serialize)]
pub struct TheOneResult {
    id: i32,
    fk_pool: i32,
    content: String,
    drunk_level: i32,
    exposure_level: i32,
    bool_drink: i32,
    activation: i32,
    author: String,
    timestamp: i64,
}

#[get("/theOne")]
pub async fn query_from_db(pool: &State<Pool<MySql>>) -> Json<Response<TheOneResult>> {
    let unwraped_pool = pool.inner();
    let results: Vec<TheOneResult> = sqlx::query_as!(
        TheOneResultWithOptions,
        "SELECT * FROM `game_klassiker_questions` WHERE NOT(fk_pool = 22)" // query for db
    )
    .fetch_all(unwraped_pool)
    .await
    .expect("Query was successfully executed")
    .iter()
    .map(|entry| {
        // create new QueryResult instance
        let mut unwraped_entry = TheOneResult {
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
