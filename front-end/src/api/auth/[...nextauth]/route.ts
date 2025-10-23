import NextAuth, { NextAuthOptions } from "next-auth"
import Auth0Provider from "next-auth/providers/auth0";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [
        Auth0Provider({
            clientId: process.env.AUTH0_CLIENT_ID!,
            clientSecret: process.env.AUTH0_CLIENT_SECRET!,
            issuer: process.env.AUTH0_ISSUER,
            authorization: {params: {scope: 'openid profile email'}},
        })
    ],
    callbacks: {
        async jwt({token, profile, account, user}) {
            // Initial sign in
            if (account && profile) {
                token.id = profile.sub || user?.id || '';

                // TODO: Get role from Auth0 user metadata or database
                // For now, hard code role as ADMIN
                token.role = 'ADMIN';
            }

            return token;
        },
        async session({session, token}) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/api/auth/signin',
        error: '/auth/error',
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }