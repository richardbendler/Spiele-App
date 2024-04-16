# Rocket.rs HTTP Server
This is the webserver for the app. It is build with Rust 1.76.0.

## Install WSL on Windows (Development device)
https://learn.microsoft.com/de-de/windows/wsl/install
- Powershell as Administrator:
`wsl --install`
- Restart Windows -> WSL continues installation automaticaly 
- choose username
- After completition: In VSCode install WSL extension -> should be suggested when starting vscode
- To start WSL just search for the program

## Install (On deleopment PC - steps need to be done to develop)
- Install Rust (Standard Installation): `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs/ | sh` (https://www.rust-lang.org/tools/install)
`. "$HOME/.cargo/env"`
`sudo apt-get update`
`sudo apt install build-essential`
`sudo apt-get install libssl-dev`
`sudo apt-get install pkg-config`
- Shift-Rightclick in \Trinkspielapp\Backend\rocket\rocket_server -> "Hier Linux-Shell öffnen"
Then: In order to use the sqlx crate, you first need to install the sqlx-cli via `cargo install sqlx-cli`. After installing the tool, create a `.env` file in the `rocket_server` folder and add `DATABASE_URL=mysql://USER:PASSWORD@HOST/DATABASE` to the newly created file.
Then, run `cargo sqlx prepare`. This will create a schema for the data in the database and allows modeling this data as a native Rust struct. 

## Old (ignore for now)
Install and download the build target specific architecture for linux server 
`rustup toolchain install stable-x86_64-unknown-linux-musl`
(`rustup toolchain list`)
`rustup default stable-x86_64-unknown-linux-musl`
`rustup target add x86_64-unknown-linux-gnu`

## Build the Server
To build an executable run `cargo build` for development builds and `cargo build --release` for production builds.
- TODO: Was von beiden benutze ich wann genau? Was ist der Unterschied im Output? - realease ist schneller 

## Test on local machine
Rocket.toml umbennen damit sie lokal nicht gefunden wird
cd target/debug/
./rocket_server

## Deploy the Build
The Rocket server files are located in `/home/trinkspielapp/rocket_server`. 
- Copy file
- Make file executable `chmod +x rocket_server`

## Strato Server Config (Starting & Stopping)
The Rocket server runs on the server as a service using `systemctl`. On rebooting the Strato server, the Rocket service should automatically start once a connection with the internet is established. The service is created by the `rocket-server.service` file located in `/etc/systemd/system`. Common `systemctl` commands include:
- `sudo systemctl start rocket-server.service`: starts the service for the Rocket server
- `sudo systemctl status rocket-server.service`: displays the status and log of the service
- `sudo systemctl stop rocket-server.service`: stops the service
- `sudo systemctl restart application.service`: restarts the service
- TODO: Woran erkenne ich beim Entwickeln ob eine Serververbindung besteht?/Daten richtig empfangen werden? -> Gibt keine Fehlermeldung in der Konsole aktuell wenn Server gestoppt ist, wäre aber sehr praktisch (bzw. Fehlermeldung kommt irgendwie erst nach so drei Minuten)

## From now on only relevant for server move

### Rocket.toml
The `Rocket.toml` acts as the configuration file for the server. Copy from `Trinkspielapp/Backend/rocket/Rocket.toml` to server (`/home/trinkspielapp/rocket_server`)

### systemd config
The configuration of the `systemd` followed [this guide](https://abhinand05.medium.com/run-any-executable-as-systemd-service-in-linux-21298674f66f). Additional information about `systemctl` can be found [here](https://www.digitalocean.com/community/tutorials/how-to-use-systemctl-to-manage-systemd-services-and-units-de).
 
### TLS Config
Rocket searches for a `Rocket.toml` config file in it's root directory. There, you can define the following for adding a TLS (SSL) certificate to the server:

```
[default.tls]
certs = "path/to/cert-chain.pem"
key = "path/to/key.pem"
```
For reference, see [this guide](https://rocket.rs/guide/v0.5/configuration//#configuration).

### Rust Compiler Target
Change build-target in .cargo/config.toml to adapt to new server
Look for new Server here: https://doc.rust-lang.org/rustc/platform-support.html



