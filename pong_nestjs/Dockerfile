FROM node:19.3.0-alpine3.17

RUN mkdir pong_nestjs
WORKDIR /pong_nestjs

COPY package.json .
RUN npm i
COPY . .
RUN npm run build


# ENTRYPOINT ["npm", "run", "start:prod"] 배포모드.
# 개발모드로 실행
# CMD ["npm", "run", "start:dev"]