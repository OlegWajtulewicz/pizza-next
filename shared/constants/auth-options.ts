import { AuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma/prisma-client";
import { compare, hashSync } from "bcrypt";
import { UserRole } from "@prisma/client";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        // GitHub OAuth provider
        GitHubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
            profile(profile) {
                return {
                    id: profile.id,
                    name: profile.name || profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                    role: "USER" as UserRole,
                };
            }
        }),
        // Credentials provider
        CredentialsProvider({ 
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }, 
            },
            async authorize(credentials) {
                if (!credentials) {
                    console.error("Credentials are missing");
                    return null;
                }

                const findUser = await prisma.user.findFirst({
                    where: { email: credentials.email },
                }).catch((err) => {
                    console.error("Error finding user:", err);
                    return null;
                });

                if (!findUser) {
                    console.error("User not found");
                    return null;
                }
                console.log('User found:', findUser);
                const isPasswordValid = await compare(credentials.password, findUser.password);
                if (!isPasswordValid) {
                    console.error("Invalid password");
                    return null;
                }
                console.log('Password entered:', credentials.password);
                if (!findUser.verified) {
                    console.error("User is not verified");
                    return null;
                }
                console.log('Is password valid:', isPasswordValid);
                return {
                    id: findUser.id,
                    email: findUser.email,
                    name: findUser.fullName,
                    role: findUser.role,
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: { 
        async signIn({ user, account }) {
            try {
                if (account?.provider === "credentials") {
                    return true;
                }

                if (!user.email) {
                    console.error("User email is missing");
                    return false;
                }

                const findUser = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { provider: account?.provider, providerId: account?.providerAccountId },
                            { email: user.email },
                        ]
                    },
                });

                if (findUser) {
                    await prisma.user.update({
                        where: { id: findUser.id },
                        data: {
                            provider: account?.provider,
                            providerId: account?.providerAccountId,
                        },
                    });
                    return true;
                }

                // Генерация безопасного случайного пароля для OAuth пользователей
                const generatedPassword = hashSync(generateRandomPassword(), 10);
                await prisma.user.create({
                    data: {
                        email: user.email,
                        fullName: user.name || `User #${user.id}`,
                        password: generatedPassword,
                        verified: new Date(),
                        provider: account?.provider,
                        providerId: account?.providerAccountId,
                    },
                });
                return true;
            } catch (error) {
                console.error('Error [SIGNIN]', error);
                return false;
            }
        },
        async jwt({ token }) {
            try {
                if (!token.email) {
                    console.error("User email is missing");
                    return token;
                }
                const findUser = await prisma.user.findFirst({
                    where: { email: token.email },
                });

                if (findUser) {
                    token.id = String(findUser.id);
                    token.email = findUser.email;
                    token.fullName = findUser.fullName;
                    token.role = findUser.role;
                } else {
                    console.error("User not found for token:", token);
                }
            } catch (error) {
                console.error("JWT callback error:", error);
            }

            return token;
        },
        session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
};

// Функция генерации случайного пароля
function generateRandomPassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}