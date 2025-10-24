import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getGuestByEmail } from "./app/_lib/supabase/guests";
import { credentials } from "./app/_lib/authjs/credentialsCallback";
import jwt from "jsonwebtoken";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    maxAge: 60 * 60 * 2,
    strategy: "jwt"
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials(credentials),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.avatar = user.avatar;
      }
      return token;
    },

    async session({ session, token }) {
      try {
        const currentGuest = await getGuestByEmail(token.email);

        if (!currentGuest) {
          console.error("Guest not found for email:", token.email);
          return session;
        }

        session.user.id = currentGuest.id;
        session.user.name = currentGuest.fullname;
        session.user.email = currentGuest.email;
        session.avatar = currentGuest.avatar;

        const signingSecret = process.env.SUPABASE_JWT_SECRET;
        if (signingSecret) {
          const payload = {
            exp: Math.floor(new Date(session.expires).getTime() / 1000),
            name: currentGuest.fullname,
            sub: currentGuest.id,
            email: currentGuest.email,
            aud: "authenticated",
            role: "authenticated",
          };
          session.supabaseAccessToken = jwt.sign(payload, signingSecret);
        }
      } catch (err) {
        console.error("Error in session callback:", err);
      }

      return session;
    },
  },
});
