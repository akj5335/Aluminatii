import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback'
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user exists
                    let user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        return done(null, user);
                    }

                    // Create new user
                    user = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
                        college: 'OAuth User',
                        photoURL: profile.photos[0]?.value
                    });

                    done(null, user);
                } catch (err) {
                    done(err, null);
                }
            }
        )
    );
}

// GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: '/auth/github/callback',
                scope: ['user:email']
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails?.[0]?.value || `${profile.username}@github.oauth`;

                    let user = await User.findOne({ email });

                    if (user) {
                        return done(null, user);
                    }

                    user = await User.create({
                        name: profile.displayName || profile.username,
                        email,
                        password: await bcrypt.hash(Math.random().toString(36), 10),
                        college: 'OAuth User',
                        photoURL: profile.photos?.[0]?.value
                    });

                    done(null, user);
                } catch (err) {
                    done(err, null);
                }
            }
        )
    );
}

// LinkedIn OAuth Strategy
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    passport.use(
        new LinkedInStrategy(
            {
                clientID: process.env.LINKEDIN_CLIENT_ID,
                clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
                callbackURL: '/auth/linkedin/callback',
                scope: ['r_emailaddress', 'r_liteprofile']
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails?.[0]?.value;

                    if (!email) {
                        return done(new Error('No email from LinkedIn'), null);
                    }

                    let user = await User.findOne({ email });

                    if (user) {
                        return done(null, user);
                    }

                    user = await User.create({
                        name: profile.displayName,
                        email,
                        password: await bcrypt.hash(Math.random().toString(36), 10),
                        college: 'OAuth User',
                        photoURL: profile.photos?.[0]?.value
                    });

                    done(null, user);
                } catch (err) {
                    done(err, null);
                }
            }
        )
    );
}
