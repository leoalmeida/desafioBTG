# Create image based on the official Node image from dockerhub
FROM node:24-alpine

# Create app directory
WORKDIR /usr/src/app

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy dependency definitions
COPY package*.json ./

# Install dependecies
#RUN npm set progress=false \
#    && npm config set depth 0 \
#    && npm i install
RUN npm ci

# Get all the code needed to run the app
COPY . .

CMD ["ng", "serve", "--port", "4200", "--host", "0.0.0.0"]
# Expose the port the app runs in
EXPOSE 4200