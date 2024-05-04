#[macro_use]
extern crate rocket;

// import routes
mod routes {
    pub mod games {
        pub mod common;
        // games start here
        pub mod activity;
        pub mod bottle_spin;
        pub mod many_questions;
        pub mod the_one;
    }
    pub mod feedback;
}

use routes::{feedback, games::*};

use rocket::serde::{json::Json, Deserialize, Serialize};
use sqlx::{MySql, MySqlPool, Pool};

// launch server
#[launch]
async fn rocket() -> _ {
    let pool = connect_to_database().await;

    rocket::build()
        .mount("/", routes![
            index, 
            send_json_test,
            feedback::query])
        .mount(
            "/games",
            routes![
                game_index,
                the_one::query,
                bottle_spin::query_truth,
                bottle_spin::query_dare,
                many_questions::query,
                activity::query
            ],
        ) // routes to all games
        .manage(pool) // access db pool from routes
}

// hello world example
#[get("/")]
fn index() -> &'static str {
    "Play The One!"
}

// example for sending JSON; Still in codebase for easy reference
#[derive(Serialize, Deserialize)]
struct Message<'r> {
    content: &'r str,
}

#[get("/json")]
fn send_json_test() -> Json<Message<'static>> {
    Json(Message {
        content: "This is a JSON object",
    })
}

// example for connecting to the database
async fn connect_to_database() -> Pool<MySql> {
    let pool = MySqlPool::connect("mysql://backenduser:REDACTED_DB_PASSWORD@45.9.63.16/TrinkspielDB").await;
    pool.expect("Server successfully connected to database")
}

// example game routes
//TODO: use this route for listing all available games
#[get("/")]
fn game_index() -> &'static str {
    "This is the index page for all games"
}
