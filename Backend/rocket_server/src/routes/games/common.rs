use serde::Serialize;

// result send to to user
#[derive(Serialize)]
pub struct Response<T> {
    pub content: Vec<T>,
}
