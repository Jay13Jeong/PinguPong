FROM node:19.3.0-alpine3.17

ENV PATH /pong_front/node_modules/.bin:$PATH

RUN mkdir pong_front
WORKDIR /pong_front

COPY package.json .
RUN npm i
COPY . .
# RUN npm install react-scripts@3.0.1 -g

CMD ["npm", "start"]

# COPY . .
# RUN npm i esbuild
# RUN npm i
# CMD [ "npm", "run" ]
