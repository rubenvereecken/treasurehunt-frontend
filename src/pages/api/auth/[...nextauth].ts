import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from "jsonwebtoken";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  jwt: {
    encode: ({ secret, token }) =>
      jsonwebtoken.sign(
        {
          ...token,
          iss: "nextauth",
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
        },
        secret
      ),
    decode: async ({ secret, token }) =>
      jsonwebtoken.verify(token!, secret) as JWT,
  },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.username = profile?.login;
      }
      return token;
    },
    session({ session, token }) {
      if (token.username) {
        session.username = token?.username;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
