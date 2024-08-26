FROM node:20-alpine As build
ARG user
ARG uid

WORKDIR /usr/src/app

COPY --chown=$user:$user package*.json ./
COPY --chown=$user:$user yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --chown=$user:$user . .

RUN yarn build

ENV NODE_ENV production

USER $user

FROM node:20-alpine As production
ARG user
ARG uid

COPY --chown=$user:$user --from=build /usr/src/app/dist ./dist
COPY package*.json ./
COPY --chown=$user:$user yarn.lock ./
RUN yarn install --production --frozen-lockfile && yarn cache clean --force

COPY ormconfig.js ./ormconfig.js
COPY .env ./.env

CMD [ "yarn", "serve" ]