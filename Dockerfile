# Use lightweight nginx alpine image
FROM nginx:alpine

# Copy the static HTML file to nginx web root
COPY index.html /usr/share/nginx/html/index.html

# Add custom nginx configuration (optional, but good for single-page apps)
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    # Enable gzip compression for faster loading
    gzip on; \
    gzip_vary on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]