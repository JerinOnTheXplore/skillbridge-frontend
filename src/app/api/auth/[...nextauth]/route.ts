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

        if (!res.ok) return null;

    return {
      id: data.data.id,
      name: data.data.name,
      email: data.data.email,
      role: data.data.role,
      accessToken: data.token, 
    };
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
  if (user) {
    token.accessToken = user.accessToken; // ✅ FIX
    token.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
  return token;
},


  async session({ session, token }) {
  session.user = token.user as any;
  session.accessToken = token.accessToken as string;
  return session;
}

},


  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
