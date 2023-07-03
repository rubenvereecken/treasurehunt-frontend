# Chatbase

Chat room app for a Treasure Hunt I organised, based on [a Grafbase tutorial](https://grafbase.com/guides/how-to-build-a-real-time-chat-app-with-nextjs-graphql-and-server-sent-events).

AI Admin Bot, written on top of GPT 3.5, lives [here](https://github.com/rubenvereecken/treasurehunt-gpt).

![Chatbase App](/public/og.png)

## Tools used

- NextAuth.js
- Next.js
- Apollo Client
- Grafbase
- Server-Sent Events
- GraphQL Live Queries
- GraphQL
- Tailwind CSS

## Local Development

1. `npm install`
2. `cp .env.example .env` and add values for environment variables
3. [Generate a secret value](https://generate-secret.vercel.app) for `NEXTAUTH_SECRET` and add it to `.env`
4. `cp grafbase/.env.example grafbase/.env`
5. Add the same `NEXTAUTH_SECRET` to `grafbase/.env`
6. `npx grafbase dev`
7. `npm run dev`
