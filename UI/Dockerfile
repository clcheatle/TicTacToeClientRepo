FROM node:latest AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY ./ /usr/src/app
RUN npm run build

FROM nginx:latest
COPY --from=builder ./usr/src/app/dist/UI /usr/share/nginx/html/
EXPOSE 80
