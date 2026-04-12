FROM node:lts-bookworm

# Install tzdata – ensures timezone support
RUN apt-get update && apt-get install -y tzdata && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Clone IAMLEGEND repo
RUN git clone https://github.com/Stanytz380/fuck . && \
    npm install

EXPOSE 3000

CMD ["npm", "start"]