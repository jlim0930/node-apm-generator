# Simple nodejs web-app and client to generate metrics, transactions, spans and load the data onto elasticsearch APM

### Requirements
- ensure that you have docker, docker-compose, npm installed.

### Configure

edit `.env` and specify:
- `ELASTIC_APM_SERVER_URL` - URL for your APM instance, can be APM server or elastic-agent running APM integration or Integration server - please ensure to add :443 at the end if you are running just normal `https`
- `ELASTIC_APM_SECRET_TOKEN` - `secretToken` to ingest data into APM - https://www.elastic.co/guide/en/observability/current/apm-secret-token.html#apm-configure-secret-token
- `ELASTIC_APM_VERIFY_SERVER_CERT` - disable SSL validation

### Run
- initial run `docker-compose up --build` or whenever you update any files run with `--build`
- if no changes were made and you need to restart you can `docker-compose up`
- you can add the `-d` option to run it in detached mode
  - to clean up and shutdown `docker-compose down`

