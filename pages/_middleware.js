import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req){
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    const { pathname } = req.nextUrl;

    // Allow the request if following is true...
    // 1) if Its a request for next-auth session & provider fetching
    // 2) if the token exists
    if(pathname.includes("/api/auth") || token){
        return NextResponse.next();         
    }
        //its uses helper function to continue ON.
        //Redirect them to login if they don't have token AND are requesting a
        //protected route
    
    if(!token && pathname !== "/login" ){
        return NextResponse.redirect("/login");
    }
    
}