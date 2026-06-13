FROM node:20.15.0-alpine
WORKDIR /usr/src/app
# Replace with actual AI service setup, e.g. python setup if using python
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
