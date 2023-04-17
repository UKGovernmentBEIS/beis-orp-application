## Installation

```bash
$ npm install
```

## Running the app

```bash
# the app stores sessions in redis docker-compose fires up a local version.
# .env values for this: REDIS_ADDRESS=localhost REDIS_PORT=6379 SESSION_SECRET=my-secret
$ docker-compose up -d

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
In order for the application to work you will need to set the environment variables. The easiest way to do this is to drop a .env file onto the root of the application. Speak to the dev team for these values.


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


## Deployment / GitHub Actions

The application will be automatically deployed on update. This means that:

1. On a new Pull Request, the tests will be run against the codebase by GitHub Actions using the `on:PullRequest` trigger
1. Once the PR is merged, GitHub Actions will create a new Release in GitHub. The versioning isn't great on this, as GHA doesn't natively support auto-increments and third-party actions don't seem suitable for our use case.  This is triggered by `on:PullRequest:Closed` on the `main` branch
1. Whenever a new Release is created in the repository, the GHA `on:Release:Created` from _any branch_ is triggered, and it will attempt to upload to ECR as the `latest` image. Please note that this means if you choose to create a Release from a feature or test branch, this _will_ result in a deployment to `dev`
1. You can confirm that the `latest` in ECR is what ECS is deploying by comparing the Digest SHA of the ECR Image with the deployed ECS Task
