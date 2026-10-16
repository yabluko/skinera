import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Extend NextAuth types
declare module 'next-auth' {
  interface User {
    surname?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      surname?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    surname?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize() {
        // TODO: backend removed — no user store, login disabled
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Якщо це новий логін, зберігаємо дані користувача в токені
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.surname = user.surname;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Передаємо дані з токена в сесію
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.surname = token.surname;
        session.user.email = token.email;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};
