# tbblog Strapi 5. One image for every server: no .env enters the build (.dockerignore); the database,
# secrets, public URL and CORS origins come from the server's .env.local at run time.
# Build and push: ./deploy-push-to-hub-secure.sh
FROM node:22-alpine AS build
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev python3 git
ENV NODE_ENV=production
WORKDIR /opt/
COPY package.json package-lock.json ./
RUN npm config set fetch-retry-maxtimeout 600000 -g
RUN npm ci --omit=dev
WORKDIR /opt/app
COPY . .
RUN npm run build

FROM node:22-alpine
RUN apk add --no-cache vips-dev
ENV NODE_ENV=production
WORKDIR /opt/
COPY --from=build /opt/node_modules ./node_modules
WORKDIR /opt/app
COPY --from=build /opt/app ./
ENV PATH=/opt/node_modules/.bin:$PATH
RUN chown -R node:node /opt/app
USER node
EXPOSE 1339
CMD ["npm", "run", "start"]
