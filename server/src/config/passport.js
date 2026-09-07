import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env.js";

export function configurePassport() {
  if (!env.googleClientId || !env.googleClientSecret || !env.googleCallbackUrl) {
    return;
  }

  passport.use(new GoogleStrategy({
    clientID: env.googleClientId,
    clientSecret: env.googleClientSecret,
    callbackURL: env.googleCallbackUrl
  }, async (_accessToken,_refreshToken,profile,done) => {
    const email = profile.emails?.[0]?.value || null;
    done(null,{
      id:profile.id,
      email,
      name:profile.displayName || profile.name?.givenName || "Google User"
    });
  }));
}
