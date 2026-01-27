import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Google OAuth
router.get('/google', (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_ID.startsWith('your') && !process.env.GOOGLE_CLIENT_ID) {
        // This is a basic check to see if the user has replaced the placeholder
        return res.status(500).send('Google OAuth is not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env file.');
    }
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/index.html' }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Redirect to frontend with token
        res.redirect(`/index.html?token=${token}&user=${encodeURIComponent(JSON.stringify({
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            photoURL: req.user.photoURL
        }))}`);
    }
);

// GitHub OAuth
router.get('/github', (req, res, next) => {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_ID.startsWith('your') && !process.env.GITHUB_CLIENT_ID) {
        return res.status(500).send('GitHub OAuth is not configured. Please add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to your .env file.');
    }
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

router.get('/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: '/index.html' }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.redirect(`/index.html?token=${token}&user=${encodeURIComponent(JSON.stringify({
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            photoURL: req.user.photoURL
        }))}`);
    }
);

// LinkedIn OAuth
router.get('/linkedin', (req, res, next) => {
    if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_CLIENT_ID.startsWith('your') && !process.env.LINKEDIN_CLIENT_ID) {
        return res.status(500).send('LinkedIn OAuth is not configured. Please add LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET to your .env file.');
    }
    passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] })(req, res, next);
});

router.get('/linkedin/callback',
    passport.authenticate('linkedin', { session: false, failureRedirect: '/index.html' }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.redirect(`/index.html?token=${token}&user=${encodeURIComponent(JSON.stringify({
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            photoURL: req.user.photoURL
        }))}`);
    }
);

export default router;
