use rocket::serde::json::Json;
use rocket::State;
use rocket::http::Status;
use serde::Deserialize;
use sqlx::{MySql, Pool};

use crate::routes::games::common::*;

#[derive(Deserialize)]
pub struct UserFeedback<'r> {
    table: &'r str,
    question_id: i32,
    feedback: i32
}

// ADD NEW TABLES HERE
const AVAILABLE_TABLES: [&str; 2] = ["game_klassiker_questions", "game_activity_words"];



#[post("/feedback", data = "<feedback>")]
pub async fn query(pool: &State<Pool<MySql>>, _key: AppKey<'_>, feedback: Json<UserFeedback<'_>>) -> Status {
    let conn = pool.inner();
    let mut tx = conn.begin().await.unwrap();
    let user_feedback = feedback.into_inner();


    // get information from feedback struct
    let table = user_feedback.table;
    let evaluation_table = {
        match table {
            "game_klassiker_questions" => "games_klassiker_evaluation",
            "game_activity_words" => "games_activity_evaluation",
            _ => ""
        }
    };

    let question_id = user_feedback.question_id.to_string();

    // check if refered to table exists
    if AVAILABLE_TABLES.contains(&table) {

        let add_or_subtract;

        match user_feedback.feedback {
            1 => add_or_subtract = String::from("+"),
            2 | 3 => add_or_subtract = String::from("-"),
            _ => add_or_subtract = String::from("")
        }

        // save action, because table is in AVAILABLE_TABLES array (no SQL injection possible)
        let query_string_update_record = format!("UPDATE {} SET popularity = popularity {} 1 WHERE id = ?", table, add_or_subtract);
        let query_string_create_entry = format!("INSERT INTO {} (id, fk_question, fk_type, value, comment, author, timestamp) VALUES (NULL, ?, ?, NULL, NULL, NULL, current_timestamp())", evaluation_table);

        // Update question record
        let update_record = sqlx::query(query_string_update_record.as_str())
        .bind(question_id.clone()) // table, question_id
        .execute(&mut *tx).await;

        // create entry in evaluation database
        let create_entry: Result<sqlx::mysql::MySqlQueryResult, sqlx::Error> = sqlx::query(query_string_create_entry.as_str())
        .bind(question_id.clone())
        .bind(user_feedback.feedback.clone())
        .execute(&mut *tx).await;

        // commit transaction
        if update_record.is_ok() && create_entry.is_ok(){
            let _ = tx.commit().await;

            println!("Successfully added feedback to database.");
            Status::Ok
        } else {
            println!("Sending feedback to database failed.");
            Status::BadRequest
        }
    } else {
        Status::BadRequest
    }
}