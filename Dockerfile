FROM node:18-alpine3.16
WORKDIR /app
COPY package.json ./
RUN yarn --network-timeout 1000000
COPY . ./
EXPOSE 3000
CMD ["yarn","run", "dev", "--host=0.0.0.0"]



# FROM node:14-alpine3.16 as build
# WORKDIR /app
# COPY package*.json ./
# RUN yarn
# COPY . ./

# RUN yarn build

# FROM nginx:1.18-alpine AS deploy

# WORKDIR /usr/share/nginx/html
# RUN rm -rf ./*
# COPY --from=build /app/dist .
# EXPOSE 3000
# ENTRYPOINT ["nginx", "-g", "daemon off;"]
