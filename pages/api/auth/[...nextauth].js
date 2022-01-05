import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi,  { LOGIN_URL } from "../../../lib/spotify";

async function  refreshAccessToken(token){
    try{
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const {body : refreshedToken} = await spotifyApi.refreshAccessToken();
        console.log("REFRESHED TOKEN IS", refreshedToken);

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000, // = 1hour as 3600 retuns from spotify
            //API
            //if they return refresh token use it, otherwise default this old one..
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        };

    }catch(error){
        console.error(error)

        return{
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
        authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages:{
      signIn: '/login'
  },
  callbacks:{
    async jwt({token, account, user}){
        //if initial sign in look at next.auth.js.org/tutorial/refresh-token-rotation
        if(account && user){
            return{
                ...token,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                username: account.providerAccountId,
                accessTokenExpires: account.expires_at * 1000, //we are handling expires time in
                //miliseconds hence * 1000
            };
        }

        //retun the previous token if the access token has not expired yet
        if(Date.now() < token.accessTokenExpires){
            console.log("EXISTING ACCESS TOKEN IS VALID");
            return token;
        }

        //if access token expires, so we need to get new access token. we refresh it..
        console.log("EXISTING ACCESS TOKEN HAS EXPIRED, REFRESHING..");
        return await refreshAccessToken(token);
    },

      //this session is what user will use to tap into their client session
    async session ({session, token }) {
        session.user.accessToken = token.accessToken; //user can see session but not the token, we need to map
        session.user.refreshToken = token.refreshToken;
        session.user.username = token.username;

        return session;
    }
  },
});