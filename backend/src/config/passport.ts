import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { users } from "./db";
import dotenv from "dotenv";

dotenv.config();

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "http://localhost:5000/api/google/callback",
        scope: ["email", "profile"],
      },
      async (_access, _refresh, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const nome = profile.displayName;
          const avatar = profile.photos?.[0]?.value;

          if (!email) return done(new Error("Email não encontrado"), undefined);

          let user = await users.findOne({ email });

          if (!user) {
            await users.insertOne({
              email,
              nome,
              avatar,
              vitorias: 0,
              derrotas: 0,
              empates: 0,
              provedor: "google",
              provedor_id: profile.id,
            });
          } else {
            await users.updateOne(
              { email },
              { $set: { avatar, nome } }
            );
          }

        user = await users.findOne({ email });
        return done(null, user);
        
        } catch (e) {
          done(e as Error, undefined);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.email);
  });

  passport.deserializeUser(async (email: string, done) => {
    try {
      const user = await users.findOne({ email });
      done(null, user);
    } catch (e) {
      done(e, null);
    }
  });
};
