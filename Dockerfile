# node version
FROM node:23-alpine

# set working directory
WORKDIR /app

# copy package files so that Docker can cache the node_modules layer
COPY package*.json ./

# install dependencies
RUN npm i

# copy project files from the source (local machine) to the destination (inside the docker container)
COPY . .

# expose port 5173 (Vite's default port)
EXPOSE 5173

# start development server
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" ]