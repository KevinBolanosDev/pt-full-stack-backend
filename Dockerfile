FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3005

ENV NODE_ENV=development
ENV PORT=3005

CMD ["npm", "start"]