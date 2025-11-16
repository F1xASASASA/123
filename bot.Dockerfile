FROM imbios/bun-node

WORKDIR /usr/local

COPY bun.lockb .
COPY package.json .
COPY packages ./packages

RUN bun install

RUN bunx prisma generate --schema=./packages/db/prisma/schema.prisma

WORKDIR /usr/local/packages/bot

ENTRYPOINT ["bun", "."]