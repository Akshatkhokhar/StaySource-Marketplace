const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User.model');

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('⚠️ Google OAuth keys are missing. "Continue with Google" will not work.');
} else {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);
      }

      // If not, check if user exists with same email
      user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // Link google profile to existing email account
        user.googleId = profile.id;
        await user.save();
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        full_name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        role: 'hotel_owner' // Default role for Google signups, can be changed later
      });

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));
}

// No session support as we use JWT
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});
