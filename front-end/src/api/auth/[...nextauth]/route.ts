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
            authorization: {params: {scope: 'openid profile'}},
        })
    ],
    callbacks: {
        async jwt({token, profile, account}) {
            if (profile) {
                token.username = profile.name
            }
            if (account) {
                token.access_token = account.access_token
            }
            return token;
        },
        async session({session, token}) {
            if (token) {
                // session.user?.name = token.username
            }
            return session;
        }
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }