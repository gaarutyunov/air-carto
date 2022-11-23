# Air quality measurements with CARTO

### Usage

1. Install [Yarn](https://yarnpkg.com/getting-started/install)

2. Install dependencies:

```shell
yarn install
```

3. [Configure](#configuration) application

4. Serve application

```shell
yarn start
```

4. Open [Swagger](http://localhost:3333/api) documentation to perform requests

### Configuration

1. Create a CARTO [account](https://app.carto.com)

2. Issue a CARTO [Bearer token](https://api-docs.carto.com/)

3. Put `.env` file in the root of the project with the following content:

```
BASE_URL=<API Base URL from https://clausa.app.carto.com/developers>
BEARER=<Bearer token>
```

For example:

```
BASE_URL=https://gcp-us-east1.api.carto.com
BEARER=dfjghu332.rrfrereg.erwt3255gg
```

### Features

1. [Nx](https://nx.dev/getting-started/intro) monorepo
2. [NestJS](https://nestjs.com/) framework
3. [Squel.js](https://hiddentao.github.io/squel/) query builder
4. [Swagger](https://swagger.io/) documentation
5. [OpenTelemetry](https://github.com/pragmaticivan/nestjs-otel) tracing
6. [Json Logger](https://github.com/iamolegga/nestjs-pino)
7. [GitHub Actions](https://docs.github.com/en/actions) CI/CD
8. [Automapper](https://automapperts.netlify.app/) for mapping DTOs to entities
9. [CARTO SQL API](https://api-docs.carto.com/#95aa64ca-128c-4c2c-b156-aa417260050e)
10. [Compodoc](https://compodoc.app/) documentation
