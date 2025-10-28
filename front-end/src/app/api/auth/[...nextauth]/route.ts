import NextAuth, { NextAuthOptions } from "next-auth"
import Auth0Provider from "next-auth/providers/auth0";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [
        Auth0Provider({
            id: "auth0",
            name: "Auth0",
            clientId: process.env.AUTH0_CLIENT_ID!,
            clientSecret: process.env.AUTH0_CLIENT_SECRET!,
            issuer: process.env.AUTH0_ISSUER,
            authorization: {
                params: {
                    scope: 'openid profile email',
                    audience: process.env.AUTH0_AUDIENCE || 'https://api.audience.autho.com'
                }
            },
        })
    ],
    callbacks: {
        async jwt({token, profile, account, user}) {
            // Initial sign in
            if (account && profile) {
                token.id = profile.sub || user?.id || '';

                if (account.access_token) {
                    token.accessToken = account.access_token;
                }

                if (account.id_token) {
                    token.idToken = account.id_token;
                }

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
                // Pass access token to client-side session
                session.accessToken = token.accessToken as string;
                // Pass id_token for logout
                session.idToken = token.idToken as string;
            }
            return session;
        }
    },
    events: {
        async signOut({ token }) {
            // Federated logout: redirect to Auth0 logout endpoint
            // This will clear the Auth0 SSO session
            if (token?.idToken) {
                const issuerUrl = process.env.AUTH0_ISSUER!;
                const logoutUrl = new URL(`${issuerUrl}/v2/logout`);
                logoutUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID!);
                logoutUrl.searchParams.set('returnTo', process.env.NEXTAUTH_URL!);

                // Note: The redirect happens on client side via signOut({ callbackUrl })
                // This event just logs the logout
                console.log('User signed out, Auth0 session should be cleared');
            }
        }
    },
    pages: {
        error: '/auth/error',
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }
