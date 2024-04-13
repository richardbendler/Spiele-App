# Rocket.rs HTTP Server
This is the webserver for the app. It is build with Rust 1.76.0. In order to compile this code [install Rust](https://www.rust-lang.org/tools/install) first on your system. To build an executable run `cargo build` for development builds and `cargo build --release` for production builds.

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

## Strato Server Config
The Rocket server runs on the server as a service using `systemctl`. On rebooting the Strato server, the Rocket service should automatically start once a connection with the internet is established. The service is created by the `rocket-server.service` file located in `/etc/systemd/system`. Common `systemctl` commands include:
- `sudo systemctl start rocket-server.service`: starts the service for the Rocket server
- `sudo systemctl status rocket-server.service`: displays the status and log of the service
- `sudo systemctl stop rocket-server.service`: stops the service
- `sudo systemctl restart application.service`: restarts the service

The configuration of the `systemd` followed [this guide](https://abhinand05.medium.com/run-any-executable-as-systemd-service-in-linux-21298674f66f). Additional information about `systemctl` can be found [here](https://www.digitalocean.com/community/tutorials/how-to-use-systemctl-to-manage-systemd-services-and-units-de).

The Rocket server files are located in `/home/trinkspielapp/rocket_server`. The `Rocket.toml` acts as the configuration file for the server.