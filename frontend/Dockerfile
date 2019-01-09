FROM node

WORKDIR /fytics/frontend
COPY package.json /fytics/frontend

RUN yarn install

CMD ["yarn", "run", "build"]