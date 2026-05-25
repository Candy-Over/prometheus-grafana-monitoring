# Stage-1
FROM node:alpine AS node-prem

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

# Stage-2
FROM node:alpine

COPY --from=node-prem /app/package*.json ./
COPY --from=node-prem /app/node_modules ./node_modules
COPY --from=node-prem /app/dist ./dist

ENV PORT=8000

EXPOSE $PORT

CMD ["npm", "run", "start"]