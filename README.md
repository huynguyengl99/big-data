# How to run

- Run `docker compose build`
- Duplicate `data copy` and rename to `data`
- Run `docker compose up kibana`
- In other terminal run `docker compose up kafka-producer-node`

# How to refresh
- Run `docker compose down`
- Delete `data` folder
- Duplicate `data copy` and rename to `data`
- Re run `docker compose up kibana`
- Re run `docker compose up kafka-producer-node`