import express from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import pool from '../config/db.ts';
import { cookie } from 'express/lib/response.js';
import { verifyUser } from '../middleware/auth.ts'
import { parse } from 'dotenv';

const router = express.Router();

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // Cookies expire after 30 days
}

// A token is signed with a user's id and our JWT secret
const generateToken = (user_id) => {
    return jwt.sign({user_id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

// Sign up
router.post('/signup', async (req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({message: 'Please provide all required fields.'});
    }

    const formattedName = name.replace(/\s/g, "");
    if (formattedName.length < 3 || formattedName.length > 24) {
        return res.status(422).json({message: 'Username should have between 3 and 24 non-space characters.'});
    }

    if (password.length < 6 || formattedName.length > 50) {
        return res.status(422).json({message: 'Password should have between 6 and 50 characters.'});
    }

    // Check if email exists
    const userEmailExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userEmailExists.rows.length > 0) {
        return res.status(400).json({message: 'User already exists. Did you mean to sign in?'});
    }

    // Check if name exists (must be unique)
    const userNameExists = await pool.query('SELECT * FROM users WHERE name = $1', [name]);

    if (userNameExists.rows.length > 0) {
        return res.status(400).json({message: 'Username is taken.'});
    }

    const hashedPassword : string = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
    });

    const newUser = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING user_id, name, email',
        [name, email, hashedPassword]
    );
    const token = generateToken(newUser.rows[0].user_id);


    res.cookie('token', token, cookieOptions);

    res.status(201).json({user: newUser.rows[0]})
})

// Login
router.post('/signin', async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({message: "Please provide all reqiured fields."});
    }

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
        return res.status(400).json({message: 'Invalid credentials.'})
    }

    const userData = user.rows[0];
    const matchingPassword = await argon2.verify(userData.password, password);
    if (!matchingPassword) {
        return res.status(400).json({message: 'Invalid credentials.'});
    }

    const token = generateToken(userData.user_id);
    res.cookie('token', token, cookieOptions);
    res.status(200).json({user: {user_id: userData.user_id, name: userData.name, email: userData.email}});
})

// Return info of the logged in user from protected middleware
router.get('/me', verifyUser, async (req, res) => {
    res.status(200).json({ user: req.user});
})

// Logout
router.post('/signout', (req, res) => {
    // Effectively delete the user's cookie (replaces token string with an empty string, and sets maximum age of the cookie to 1 ms)
    res.cookie('token', '', {...cookieOptions, maxAge: 1});
    res.status(200).json({message: 'Logged out successfully'});
})

// Delete account
router.delete('/user/:user_id', async (req, res) => {
    // Pull out the id of the user to be deleted
    const {user_id} = req.params;

    if (user_id === undefined) {
        return res.status(400).json({message: 'Invalid user.'});
    }

    const accountDeletion = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [user_id]);

    if (accountDeletion.rows.length === 0) {
        return res.status(404).json({message: 'User not found.'});
    }

    res.cookie('token', '', {...cookieOptions, maxAge: 1});
    return res.status(200).json({message: 'Deleted account successfully.'});
})

// Get reviews
router.get('/reviews', async (req, res) => {
    try {
        let page = parseInt(req?.query?.page) || 1;
        let perPage = parseInt(req?.query?.perPage) || 10;

        if (perPage > 10000) {
            perPage = 10000;
        }
        if (perPage < 0) {
            perPage = 10;
        }
        if (page < 1) {
            page = 1;
        }

        const offset = ((page - 1) * perPage);
        const selectedReviews = await pool.query('SELECT * FROM reviews ORDER BY created_at LIMIT $1 OFFSET $2', [perPage, offset]);
        return res.status(200).json({page: page, perPage: perPage, reviews: selectedReviews.rows});
    } catch (reviewsError) {
        return res.status(500).json({message: 'Failed to fetch reviews.'});
    }
})

// Post review
router.post('/reviews', verifyUser, async (req, res) => {
    try {
        const {rating, textContent, locationId} = req.body;
        const verifiedUser = req.user;

        if (!rating) {
            return res.status(400).json({message: 'Missing required rating.'});
        }
        if (!locationId) {
            return res.status(400).json({message: 'Missing required location id.'});
        }
        if (textContent && textContent.length > 500) {
            return res.status(400).json({message: 'Text content must be 500 characters or less.'});
        }
        
        const newReview = await pool.query('INSERT INTO reviews (rating, text_content, location_id, poster_id) VALUES ($1, $2, $3, $4) RETURNING location_id, rating, text_content, poster_id',
            [rating, textContent, locationId, verifiedUser.user_id]
        );
        return res.status(200).json({newReview: newReview.rows[0]});
    } catch (reviewsError) {
        return res.status(500).json({message: 'Failed to fetch locations.'});
    }
})

// Get locations
router.get('/locations', async (req, res) => {
    try {
        const locationId = parseInt(req?.query?.id) || null;
        let paramsList = [];

        let query = 'SELECT * FROM locations';
        if (locationId != null) {
            query += ' WHERE location_id = $1';
            paramsList.push(locationId);
        }
       
        const selectedLocations = await pool.query(query, paramsList);
        return res.status(200).json({locations: selectedLocations.rows});
    } catch (reviewsError) {
        return res.status(500).json({message: 'Failed to fetch locations.'});
    }
})


export default router;