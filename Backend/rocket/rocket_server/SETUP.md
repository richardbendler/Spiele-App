# SETUP of Backend (Only relevant for server move)

## Rocket.toml
The `Rocket.toml` acts as the configuration file for the server. Copy from `Trinkspielapp/Backend/rocket/Rocket.toml` to server (`/home/trinkspielapp/rocket_server`)

## systemd config
The configuration of the `systemd` followed [this guide](https://abhinand05.medium.com/run-any-executable-as-systemd-service-in-linux-21298674f66f). Additional information about `systemctl` can be found [here](https://www.digitalocean.com/community/tutorials/how-to-use-systemctl-to-manage-systemd-services-and-units-de).
 
## TLS Config
Rocket searches for a `Rocket.toml` config file in it's root directory. There, you can define the following for adding a TLS (SSL) certificate to the server:

```
[default.tls]
certs = "path/to/cert-chain.pem"
key = "path/to/key.pem"
```
For reference, see [this guide](https://rocket.rs/guide/v0.5/configuration//#configuration).

## Rust Compiler Target
Change build-target in .cargo/config.toml to adapt to new server
Look for new Server here: https://doc.rust-lang.org/rustc/platform-support.html



