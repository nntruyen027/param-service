FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production
ENV SERVICE_PORT=3001
ENV EUREKA_SERVER=http://microservice-server:8761/eureka/
ENV MONGO_URI=mongodb://admin:admin@mongo:27017/parameters?authSource=admin
ENV TELEGRAM_BOT_TOKEN=7996133529:AAFQqJuCkyEOT4Lk5n95NglpwdrrzKDlaok

# Mở cổng của container
EXPOSE 3001

# Lệnh chạy ứng dụng khi container khởi động
CMD ["node", "bin/www"]