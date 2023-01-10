FROM node:19.3.0-alpine3.17

RUN mkdir pong_front
WORKDIR /pong_front

# COPY package.json .
# RUN npm i
# COPY . .

# ENTRYPOINT ["cat"]

COPY . .
RUN npm i esbuild
RUN npm i
CMD [ "npm", "run" ]
