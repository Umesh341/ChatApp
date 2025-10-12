import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (userId, res) => {
    const token = jwt.sign(
        { userId }, process.env.JWT_SECRET, { expiresIn: '7d' }
    );
    res.cookie("jwt", token, {
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        secure: process.env.NODE_ENV === 'production', // set secure flag in production
        sameSite: 'Strict', // adjust sameSite attribute as needed
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });  

    return token;
}

export default generateToken;