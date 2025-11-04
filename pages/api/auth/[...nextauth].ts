import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Nom d'utilisateur", type: "text", placeholder: "jsmith" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials, req) {
        // Ici, vous devriez vérifier les identifiants par rapport à votre base de données ou un service d'authentification.
        // Pour l'instant, c'est un exemple simple.
        if (credentials?.username === "Sales" && credentials?.password === "Prado509!") {
          return { id: "1", name: "Admin User", email: "admin@example.com" };
        }
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin', // Page de connexion personnalisée
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});
