```shell
curl -o ./migrations/jawiki-page.sql.gz \
  https://dumps.wikimedia.org/jawiki/20170620/jawiki-20170620-page.sql.gz
gunzip ./migrations/jawiki-page.sql.gz

curl -o ./migrations/jawiki-langlinks.sql.gz \
  https://dumps.wikimedia.org/jawiki/20170620/jawiki-20170620-langlinks.sql.gz
gunzip ./migrations/jawiki-langlinks.sql.gz

docker-compose up --build -d

docker-compose exec db \
  sh -c 'mysql -uwiki -pwiki wikipedia < /migrations/jawiki-page.sql'
docker-compose exec db \
  sh -c 'mysql -uwiki -pwiki wikipedia < /migrations/jawiki-langlinks.sql'
```
