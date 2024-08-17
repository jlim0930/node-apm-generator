# Simple nodejs web-app and client to generate metrics, transactions, spans and load the data onto elasticsearch APM

### Requirements
- ensure that you have docker, docker-compose, npm installed.

### Configure

edit `.env` and specify:
- APM server hostname - please ensure to add the port to the URL even if you are just using the default https port ie `https://apm.example.com:443`
- `serviceToken` - https://www.elastic.co/guide/en/observability/current/apm-secret-token.html#apm-configure-secret-token

### Run
- initial run `docker-compose up --build
- if no changes were made and you need to restart you can `docker-compose up`

