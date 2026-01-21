# # client/Dockerfile
# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build

# FROM nginx:stable-alpine
# COPY --from=builder /app/dist /usr/share/nginx/html
# # Optionally copy custom nginx.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
