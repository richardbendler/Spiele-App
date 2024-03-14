use rocket::serde::json::Json;
use rocket::State;
use sqlx::{MySql, Pool};

use crate::routes::games::common::*;


#[get("/theOne")]
pub async fn query(pool: &State<Pool<MySql>>, _key: AppKey<'_>) -> Json<Response<ClassicGamesResult>> {
    let unwraped_pool = pool.inner();
    let results: Vec<ClassicGamesResult> = sqlx::query_as!(
        ClassicGamesResultWithOptions,
        "SELECT * FROM `game_klassiker_questions` WHERE NOT(fk_pool = 22)" // query for db
    )
    .fetch_all(unwraped_pool)
    .await
    .expect("Query was successfully executed")
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
