# Not best version, should serve with nginx (will update)

FROM node as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
RUN npm install --silent
RUN npm install react-scripts -g --silent
COPY . ./

EXPOSE 3000
CMD [ "npm", "start"]