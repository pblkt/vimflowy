# DEPLOYMENT

## Docker

Vimflowy supports deployment with docker.
A docker image is hosted on [Docker hub](https://hub.docker.com/r/vimflowy/vimflowy/).
Check out [the `Dockerfile`](/Dockerfile) for technical details.

### Example deployment

First, we download the image:
```
docker pull vimflowy/vimflowy
```

Next, we create a volume called `vimflowy-db` (you can rename this to your liking) to hold the
[SQLite](storage/SQLite.md) databases.

```
docker volume create vimflowy-db
```

Lastly, we run vimflowy container, mounting in the `vimflowy-db` volume

```
docker run -d \
             -e VIMFLOWY_PASSWORD=supersecretpassword \
             --name vimflowy \
             --mount source=vimflowy-db,target=/app/db \
             -p 3000:3000 \
             --restart unless-stopped \
             vimflowy/vimflowy
```

### Docker Compose with automatic HTTPS

We can use [Caddy](https://caddyserver.com)  and Docker Compose to run Vimflowy behind HTTPS proxy.

docker-compose.yml
```
version: '2'
services:
  tasks:
    image: vimflowy/vimflowy
    container_name: tasks
    restart: always
    environment:
      VIMFLOWY_PASSWORD: 'supersecretpassword'
    ports:
      - "3000"
    volumes:
      - "vimflowy-db:/app/db"
  server:
    image: abiosoft/caddy
    container_name: caddy
    restart: always
    ports:
    - "80:80"
    - "443:443"
    links:
    - tasks
    volumes:
    - "./Caddyfile:/etc/Caddyfile"

volumes:
  vimflowy-db:
```

Make sure that in the same directory `Caddyfile` exists.

```
yourdomain.com {
    proxy / http://tasks:3000/ {
        websocket
    }
    tls your@email.com
}
```

### Environment variables

You can override certain aspects of the container through environment variables (specified in `-e` options in the `docker run` command).

* `VIMFLOWY_PASSWORD`: The server password, specified by the user in *Settings > Data Storage > Vimflowy Server*

## From source

Of course, you can also deploy from source yourself.

- Build from our [`Dockerfile`](/Dockerfile), if you want to deploy in a container
  ```
  docker build .  -t vimflowy:dev
  ```
- Follow the [dev setup](/docs/dev_setup.md) instructions, otherwise.
  You will likely want to run the server enabling the [SQLite backend](storage/SQLite.md).
