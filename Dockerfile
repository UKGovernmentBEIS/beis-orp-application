# Stage: base image
ARG BUILD_NUMBER
ARG GIT_REF

FROM node:lts-slim as base

ENV TZ=Europe/London
RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

RUN addgroup --gid 2000 --system appgroup && \
    adduser --uid 2000 --system appuser --gid 2000

WORKDIR /app

RUN apt-get update && \
    apt-get upgrade -y

# Stage: build assets
FROM base as build
ARG BUILD_NUMBER
ARG GIT_REF

RUN apt-get install -y make python3 g++

COPY package*.json ./

RUN npm ci --no-audit

COPY . .
RUN npm run build

ENV BUILD_NUMBER ${BUILD_NUMBER:-1_0_0}
ENV GIT_REF ${GIT_REF:-dummy}
RUN BUILD_NUMBER=${BUILD_NUMBER} GIT_REF=${GIT_REF} ./scripts/record-build-info

RUN npm prune --no-audit --production

# Stage: copy production assets & dependencies
FROM base

RUN apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

COPY --from=build --chown=appuser:appgroup \
        /app/package.json \
        /app/package-lock.json \
        ./

COPY --from=build --chown=appuser:appgroup \
        /app/build-info.json ./dist/build-info.json

COPY --from=build --chown=appuser:appgroup \
        /app/dist ./dist

COPY --from=build --chown=appuser:appgroup \
        /app/node_modules ./node_modules

EXPOSE 3000
ENV NODE_ENV='production'
USER 2000

CMD [ "npm", "run", "start:migrate:prod" ]
