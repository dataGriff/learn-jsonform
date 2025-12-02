FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

# Copy the built app (includes schemas and ui in dist)
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx config for SPA routing with proper static file handling
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Serve static assets directly \
    location ~* \.(json|js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        try_files $uri =404; \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # SPA fallback for all other routes \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copy startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]