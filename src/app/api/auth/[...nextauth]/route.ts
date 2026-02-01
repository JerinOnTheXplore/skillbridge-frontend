import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            {
          email: credentials?.email,
          password: credentials?.password,
            }
          ),
        });

        const data = await res.json();

        if (res.ok && data.token) {
          return { ...data.user, token: data.token }; // return typed user..
        }

        return null;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user?.token) token.accessToken = user.token;
      if (user) token.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      };
      return token;
    },
    async session({ session, token }) {
      if (token.user) session.user = token.user;
      if (token.accessToken) session.accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
