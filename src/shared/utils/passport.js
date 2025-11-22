// #src/modules/authentication/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GithubStrategy } from 'passport-github2';
import User from '#src/modules/user/user.model.js';
import crypto from 'crypto';

// ------------------------
// GOOGLE STRATEGY
// ------------------------
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:
                process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Extract email from profile
                const email =
                    profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

                if (!email) {
                    return done(null, false, { message: 'No email found in Google profile' });
                }

                // Find existing user or by Google authProviderId
                let user = await User.findOne({
                    $or: [{ email }, { authProvider: 'google', authProviderId: profile.id }],
                });

                if (!user) {
                    user = await User.create({
                        name: profile.displayName || 'Google User',
                        email,
                        authProvider: 'google',
                        authProviderId: profile.id,
                        password: crypto.randomBytes(20).toString('hex'), // random password for local
                        passwordConfirm: crypto.randomBytes(20).toString('hex'),
                        image: {
                            public_id: `google-${profile.id}`,
                            url:
                                profile.photos && profile.photos.length > 0
                                    ? profile.photos[0].value
                                    : 'https://via.placeholder.com/150',
                        },
                    });
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

// ------------------------
// GITHUB STRATEGY
// ------------------------
passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL:
                process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/api/auth/github/callback',
            scope: ['user:email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Extract email
                const email =
                    profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

                if (!email) {
                    return done(null, false, { message: 'No email found in GitHub profile' });
                }

                // Find existing user or by GitHub authProviderId
                let user = await User.findOne({
                    $or: [{ email }, { authProvider: 'github', authProviderId: profile.id }],
                });

                if (!user) {
                    user = await User.create({
                        name: profile.displayName || profile.username || 'GitHub User',
                        email,
                        authProvider: 'github',
                        authProviderId: profile.id,
                        password: crypto.randomBytes(20).toString('hex'), // random password for local
                        passwordConfirm: crypto.randomBytes(20).toString('hex'),
                        image: {
                            public_id: `github-${profile.id}`,
                            url:
                                profile.photos && profile.photos.length > 0
                                    ? profile.photos[0].value
                                    : 'https://via.placeholder.com/150',
                        },
                    });
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

export default passport;
