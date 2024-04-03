FROM node:20.11.0

WORKDIR /app

RUN npm install --global pm2

COPY ./package*.json ./

RUN npm install

COPY ./ ./

RUN npm run build

ENV APP_ENV=${APP_ENV}
ENV APP_DEV_API_URL=${APP_DEV_API_URL}
ENV APP_PROD_API_URL=${APP_PROD_API_URL}

RUN chown -R node ./.next

EXPOSE 3000

USER node

CMD ["pm2-runtime", "start", "npm", "--", "start" ]