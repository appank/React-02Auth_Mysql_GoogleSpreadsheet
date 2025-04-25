const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"], // 🔥 Tambahkan ini
    },
    // (accessToken, refreshToken, profile, done) => {
    //   // Di sini kamu bisa simpan user ke DB, sekarang kita return langsung
    //   return done(null, profile);
    // }
    (accessToken, refreshToken, profile, done) => {
      console.log("Google Profile:", profile); // 🔍 debug
        const user = {
          email: profile.emails?.[0]?.value || null,
          displayName: profile.displayName,
          photo: profile.photos?.[0]?.value || null,
        };
        return done(null, user);
      }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
