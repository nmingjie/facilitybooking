import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        // if (!credentials?.email || !credentials?.password) {
        //   throw new Error("Invalid credentials");
        // }
        console.log("test authorize login with ", credentials);

        const res = await fetch(
          "https://ste-fem2-internet-app.azurewebsites.net/api/auth/Login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          }
        );
        
        // res.json().then((json) => {
        //   if (res.ok) {
        //     return Promise.resolve(json)
        //   }
        //   return Promise.reject(json)
        // })

        if (!res.ok) {
          throw new Error("Invalid Credentials");
          // throw new Error(await res.json());
        }
        return await res.json();

        // if (user) {
        //     // Any object returned will be saved in `user` property of the JWT
        //     return user;
        //   } else {
        //     // If you return null then an error will be displayed advising the user to check their details.
        //     throw new Error('Invalid credentials');

        //     // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        //   }
        // const user = await prisma.user.findUnique({
        //   where: {
        //     email: credentials.email
        //   }
        // });

        // if (!user || !user?.hashedPassword) {
        //   throw new Error('Invalid credentials');
        // }

        // const isCorrectPassword = await bcrypt.compare(
        //   credentials.password,
        //   user.hashedPassword
        // );

        // if (!isCorrectPassword) {
        //   throw new Error('Invalid credentials');
        // }

        // return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  //   debug: process.env.NODE_ENV === "development",
  //   session: {
  //     strategy: "jwt",
  //   },
  //   secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
