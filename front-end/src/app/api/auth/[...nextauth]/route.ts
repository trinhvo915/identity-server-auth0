import NextAuth, { NextAuthOptions } from "next-auth"
import Auth0Provider from "next-auth/providers/auth0";
import { apiClient } from '@/core/utils/configs/axios.config';
import {UserProfileService} from "@/core/services/user/user-profile.service";
import {CreateUserFromAuth0Request} from "@/core/models/user/user.types";

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
        async signIn({ user, account, profile }) {
            if (account && profile) {
                try {
                    if (account.access_token) {
                        apiClient.defaults.headers.common.Authorization = `Bearer ${account.access_token}`;
                    }

                    const createUserRequest: CreateUserFromAuth0Request = {
                        sub: profile.sub as string,
                        email: profile.email,
                        name: profile?.name,
                        picture: user?.image
                    };

                    const response = await UserProfileService.syncUserFromAuth0AndGetRoles(createUserRequest);
                    console.log("response : ", response)
                    if (response.data.roles && response.data.roles.length > 0) {
                        user.roles = response.data.roles.map(role => role.code);
                    }

                    return true;
                } catch (error) {
                    console.error("Failed to create user from Auth0:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({token, profile, account, user}) {
            if (account && profile && user) {
                token.id = profile.sub || user?.id || '';

                if (account.access_token) {
                    token.accessToken = account.access_token;
                    apiClient.defaults.headers.common.Authorization = `Bearer ${account.access_token}`;
                }

                if (account.id_token) {
                    token.idToken = account.id_token;
                }

                if (user.roles) {
                    token.roles = user.roles;
                } else {
                    token.roles = [];
                }
            }

            return token;
        },
        async session({session, token}) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.roles = token.roles as string[];
                session.accessToken = token.accessToken as string;
                session.idToken = token.idToken as string;
            }
            return session;
        }
    },
    events: {
        async signOut({ token }) {
            if (token?.idToken) {
                const issuerUrl = process.env.AUTH0_ISSUER!;
                const logoutUrl = new URL(`${issuerUrl}/v2/logout`);
                logoutUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID!);
                logoutUrl.searchParams.set('returnTo', process.env.NEXTAUTH_URL!);
            }
        }
    },
    pages: {
        error: '/auth/error',
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }