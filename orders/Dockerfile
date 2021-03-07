FROM node:alpine
ENV CI=true

WORKDIR /app
COPY package.json .
#We don't want to install the dev dependencies like jest in the production environment
RUN npm install --only=prod 
COPY . .

CMD ["npm", "start"]

