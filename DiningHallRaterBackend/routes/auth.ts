import express from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import pool from '../config/db.ts';
import { cookie } from 'express/lib/response.js';
import { verifyUser } from '../middleware/auth.ts'

const router = express.Router();

// Register a new user
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // Cookies expire after 30 days
}

// A token is signed with a user's id and our JWT secret
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

router.post('/signup', async (req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({message: 'Please provide all required fields.'});
    }

    const formattedName = name.replace(/\s/g, "");
    if (formattedName.length < 3 || formattedName.length > 24) {
        return res.status(422).json({message: 'Username should have between 3 and 24 non-space characters.'})
    }

    if (password.length < 6 || formattedName.length > 50) {
        return res.status(422).json({message: 'Password should have between 6 and 50 characters.'})
    }

    // Prevents SQL injections!!!
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userExists.rows.length > 0) {
        return res.status(400).json({message: 'User already exists.'});
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
    const token = generateToken(newUser.rows[0].id);


    res.cookie('token', token, cookieOptions);

    return res.status(201).json({user: newUser.rows[0]})
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

    const token = generateToken(userData.id);
    res.cookie('token', token, cookieOptions);
    res.json({user: {id: userData.id, name: userData.name, email: userData.email}});
})

// Return info of the logged in user from protected middleware
router.get('/me', verifyUser, async(req, res) => {
    res.json(req.user)
})

// Logout
router.post('/signout', (req, res) => {
    // Effectively delete the user's cookie (replaces token string with an empty string, and sets maximum age of the cookie to 1 ms)
    res.cookie('token', '', {...cookieOptions, maxAge: 1});
    res.json({message: 'Logged out successfully'});
})

export default router;