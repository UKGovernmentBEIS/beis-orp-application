## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

The application can be run via docker. When building the BUILD_NUMBER and GIT_REF arguments are optional and will be returned by the /health endpoint
```bash
# build image
$ docker build -t orm --build-arg BUILD_NUMBER={buildNumber} --build-arg GIT_REF={gitref} .

# run container
$ docker run -dp 3000:3000 orm
```
Image will be accessible via `http://localhost:3000/`
