# SETUP of Backend (Only relevant for server move)

## Rocket.toml
The `Rocket.toml` acts as the configuration file for the server. Copy from `Trinkspielapp/Backend/rocket/Rocket.toml` to server (`/home/trinkspielapp/rocket_server`)

## systemd config
The configuration of the `systemd` followed [this guide](https://abhinand05.medium.com/run-any-executable-as-systemd-service-in-linux-21298674f66f). Additional information about `systemctl` can be found [here](https://www.digitalocean.com/community/tutorials/how-to-use-systemctl-to-manage-systemd-services-and-units-de).
Important commands from the article:
sudo nano /etc/systemd/system/rocket-server.service

Content:
[Unit]
Description=Service that keeps running the rocket-server from startup.
After=network.target
[Install]
WantedBy=multi-user.target
[Service]
Type=simple
ExecStart=/home/trinkspielapp/rocket_server/rocket_server
WorkingDirectory=/home/trinkspielapp/rocket_server
Restart=always
RestartSec=5
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=%n

Then:
sudo systemctl daemon-reload
sudo systemctl enable rocket-server.service
chmod +x rocket_server
sudo systemctl start rocket-server.service
sudo systemctl status rocket-server.service
Logs: sudo journalctl -f -u rocket-server.service
 
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



