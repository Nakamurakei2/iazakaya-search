FROM node:22-alpine
WORKDIR /usr/src/app

# 同じ階層にある package.json をシンプルにコピー
COPY package*.json ./
RUN npm install

# srcフォルダやその他のファイルをすべてコピー
COPY . .

EXPOSE 3000
CMD ["sh", "-c", "node scripts/init-db.js && npm run dev"]