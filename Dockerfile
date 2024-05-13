# latest

FROM node   

WORKDIR /app 

COPY package*.json ./

RUN npm install 

COPY . . 

EXPOSE 3000 

CMD [ "npm", "run", "start" ] 


# DOCKER BUILD