use rocket::time::OffsetDateTime;
use serde::Serialize;
use rocket::http::Status;
use rocket::request::{Request, FromRequest, Outcome};

//TODO: change to proper autorization key later
// app key for connecting to this server
const APPKEY: &str = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFwcCJ9LCJpYXQiOjE2OTExNzU2OTV9.TqiVCGJdiq8lgn9-akwwzoRLxR5KZhllRXr_yWQL9JE";

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
    pub popularity: i32,
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
    pub popularity: i32,
    pub timestamp: i64,
}


// key for authenticating a query comes from the app
pub struct AppKey<'r>(&'r str);

#[derive(Debug)]
pub enum AppKeyError {
    Missing,
    Invalid
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for AppKey<'r> {
    type Error = AppKeyError;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        // check if key is correct
        fn is_valid(key: &str) -> bool {
            key == APPKEY
        }

        match req.headers().get_one("api-key") {
            None => Outcome::Error((Status::BadRequest, AppKeyError::Missing)),
            Some(key) if is_valid(key) => Outcome::Success(AppKey(key)),
            Some(_) => Outcome::Error((Status::BadRequest, AppKeyError::Invalid))
        }
    }
}