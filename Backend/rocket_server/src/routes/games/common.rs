use rocket::time::OffsetDateTime;
use serde::Serialize;

// result send to to user
#[derive(Serialize)]
pub struct Response<T> {
    pub content: Vec<T>,
}

pub struct ClassicGamesResultWithOptions {
    pub id: i32,
    pub fk_pool: i32,
    pub content: Option<String>,
    pub drunk_level: i32,
    pub exposure_level: i32,
    pub bool_drink: i32,
    pub activation: i32,
    pub author: Option<String>,
    pub timestamp: OffsetDateTime,
}

// defines result from db query without Options
#[derive(Serialize)]
pub struct ClassicGamesResult {
    pub id: i32,
    pub fk_pool: i32,
    pub content: String,
    pub drunk_level: i32,
    pub exposure_level: i32,
    pub bool_drink: i32,
    pub activation: i32,
    pub author: String,
    pub timestamp: i64,
}