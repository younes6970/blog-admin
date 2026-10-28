FROM 172.16.6.13:8081/base-image/node-tzdata:20-alpine AS deps

WORKDIR /app

COPY package*.json .npmrc ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps


FROM 172.16.6.13:8081/base-image/node-tzdata:20-alpine AS builder

WORKDIR /app

ARG APP_ENV
ENV APP_ENV=$APP_ENV

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN cp .env.${APP_ENV}  .env.production
RUN npx react-router build


FROM 172.16.6.13:8081/base-image/nginx-tzdata:alpine

COPY --from=builder /app/build/client /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
