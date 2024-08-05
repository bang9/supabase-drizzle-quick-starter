ARG NODE_VERSION=20.14
ARG ALPINE_VERSION=3.19

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base
WORKDIR /app
RUN corepack enable
ENV CI=1

## Builder
FROM base AS builder
# RUN apk update
# RUN apk add --no-cache git jq

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm -r build

## Runner
FROM base AS runner

COPY --from=builder ./app .

RUN pnpm install --production

ENV FASTIFY_ADDRESS=0.0.0.0 PORT=3000
EXPOSE 3000

CMD pnpm fastify start apps/server/dist/app.js -o -P
