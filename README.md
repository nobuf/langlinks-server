# Langlinks Server

This tiny server might answer a question like "How do you say ラーメン in different languages?":

```shell
docker compose up -d
curl "http://localhost:8080/search/%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3"
```

Here we go :ramen:

```json
{"ar":"رامن","de":"Ramen","en":"Ramen","zh":"日本拉面"}
```

## How it works and motivation

It looks up a Wikipedia page by using exact match with title, then searches linked pages in other languages. Instead of accessing external API, it uses local database. You have to download a few hundred mega bytes of Wikipedia data first.

While it's not intended to be used as a multilingual dictionary, it might be useful for batch translation for well-known objects.

## Setup

```shell
docker --version
Docker version 27.5.1, build 9f9e405

docker compose version
Docker Compose version v2.32.4
```

```shell
git clone https://github.com/nobuf/langlinks-server.git
cd langlinks-server
# Expose this server to other Docker containers
docker network create langlinks
docker compose up --build -d
```

This should bring up two containers. Once they are ready, download a couple of Wikipedia dump files and import them. The below example uses jawiki, but it should work with any language as far as you have `page` and `langlinks` data set. jawiki's each file is about 120MB.

```shell
curl -o ./migrations/jawiki-page.sql.gz \
  https://dumps.wikimedia.org/jawiki/latest/jawiki-latest-page.sql.gz
gunzip ./migrations/jawiki-page.sql.gz

curl -o ./migrations/jawiki-langlinks.sql.gz \
  https://dumps.wikimedia.org/jawiki/latest/jawiki-latest-langlinks.sql.gz
gunzip ./migrations/jawiki-langlinks.sql.gz
```

Importing those data would take some time on an average laptop environment.

```shell
docker compose exec db \
  sh -c 'mysql -uwiki -pwiki wikipedia < /migrations/jawiki-page.sql'
docker compose exec db \
  sh -c 'mysql -uwiki -pwiki wikipedia < /migrations/jawiki-langlinks.sql'
```

And that's it. By default, it's running on `8080` port. See docker-compose.yml.

## API Reference

Depending on your Docker environment, the endpoint might differ. If you are using Docker for Mac, it's most likely `http://localhost:8080`.

- `GET /search/[term]`
  - Parameters
    - `term` (`string`) — Specify the title of a Wikipedia page. The title appears in web address. For instance, "Munakata,_Fukuoka". Not "Munakata, Fukuoka".
  - Response
    - key: language code
    - value: translated word

```json
{
  "ar": "رامن",
  "az": "Ramen",
  "be": "Рамэн",
  "be-x-old": "Рамэн",
  "zh": "日本拉面",
  "zh-yue": "拉麪 (日本)"
}
```



## Contributing

If you have any ideas let @nobuf know by opening an issue. Pull requests are always welcome :)

## License

MIT
