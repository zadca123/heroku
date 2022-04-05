FROM node:14.16.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]

# RUN addgroup app && adduser -S -G app app
# RUN mkdir node_modules/.cache data
# RUN chown app:app node_modules/.cache data
# USER app
# ENV API_URL=https://api.myapp.com/
# EXPOSE 3000
# CMD ["npm", "start"]


# RUN addgroup app && adduser -S -G app app
# RUN mkdir node_modules/.cache
# RUN chown app:app node_modules/.cache

# USER app
# CMD ["npm", "start"]
