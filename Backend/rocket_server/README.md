# Rocket.rs HTTP Server
This is the webserver for the app. It is build with Rust 1.76.0. To build an executable run `cargo build`.

## Install
In order to use the sqlx crate, you first need to install the sqlx-cli via `cargo install sqlx-cli`. After installing the tool, create a `.env` file in the `rocket_server` folder and add `DATABASE_URL=mysql://USER:PASSWORD@HOST/DATABASE` to the newly created file.
Then, run `cargo sqlx prepare`. This will create a schema for the data in the database and allows modeling this data as a native Rust struct. 

## TLS Config
Rocket searches for a `Rocket.toml` config file in it's root directory. There, you can define the following for adding a TLS (SSL) certificate to the server:

```
[default.tls]
certs = "path/to/cert-chain.pem"
key = "path/to/key.pem"
```
For reference, see [this guide](https://rocket.rs/guide/v0.5/configuration//#configuration).