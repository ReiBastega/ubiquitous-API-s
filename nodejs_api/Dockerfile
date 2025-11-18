#stage 1

FROM node:lts-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

COPY tsconfig.json ./

RUN npm i

COPY src ./src

RUN npm run build

#stage 2

FROM node:lts-alpine 

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json ./

COPY --from=build /usr/src/app/package-lock.json ./

RUN npm i

COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "./dist/server.js"] 

