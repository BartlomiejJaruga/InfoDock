# Build stage
FROM node:18 as build

WORKDIR /app

# package-lock.json should be added here when project leaves development stage and enters production stage
COPY package.json package-lock.json ./    
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
