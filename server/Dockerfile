FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5000

CMD ["npm", "run", "dev"] 