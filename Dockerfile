FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build --configuration=${BUILD_CONFIGURATION}

FROM nginx:alpine
COPY --from=builder /app/dist/vrwallet/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 1212

CMD ["nginx", "-g", "daemon off;"]
