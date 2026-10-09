
import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Resume from "../models/Resume.js";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { sendEmail } from "../thirdPartyAPIs/userEmail.js";
import { applyAdminEmail } from "../utils/adminEmail.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Base URL of the frontend app (NOT the API) - used to build links that go in emails.
// Falls back to the Vite dev server default so local dev keeps working out of the box.
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return token;
}

//controller for user registeration
//POST:/api/users/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //Check if required fields are present
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        // check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });

        }
        //create new user
        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const newUser = await User.create({
            name, email, password: hashedPassword,
            verificationToken,
            verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        })

        // Best-effort: don't fail signup if the email provider hiccups, just log it.
        try {
            const verifyLink = `${CLIENT_URL}/verify-email/${verificationToken}`;
            await sendEmail(
                newUser.email,
                verifyLink,
                "Verify your email - Prime Resume AI",
                `<h3>Welcome to Prime Resume AI!</h3><p>Please verify your email address to activate your account:</p><a href="${verifyLink}">${verifyLink}</a><p>This link expires in 24 hours.</p>`
            );
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError.message);
        }

        //return success message
        const token = generateToken(newUser._id)
        newUser.password = undefined;
        return res.status(201).json({ message: "User created succcessfully", token, user: newUser })

    } catch (error) {
        return res.status(400).json({ message: error.message })

    }
}

//controller for user login
//POST: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // check if user already exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });

        }
        //Check if paasword is correct
        if (!user.comparePassword(password)) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        await applyAdminEmail(user);

        //return success message
        const token = generateToken(user._id)
        user.password = undefined;

        return res.status(201).json({ message: "Login succcessfully", token, user })

    } catch (error) {
        return res.status(400).json({ message: error.message })

    }
}

//controller for Google signup/login
//POST: /api/users/google-auth
// Expects { credential } - the ID token returned by Google's Sign In With Google button
export const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ message: "Missing Google credential" });
        }

        // Verify the token with Google - this confirms it was really issued by Google
        // for OUR client id and hasn't been tampered with, so we can trust the payload.
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, email_verified } = payload;

        if (!email || !email_verified) {
            return res.status(400).json({ message: "Google account email is not verified" });
        }

        // Look up by googleId first, then fall back to email so an existing
        // password-based account with the same email gets linked instead of duplicated.
        let user = await User.findOne({ googleId });
        if (!user) {
            user = await User.findOne({ email });
            if (user) {
                // Link existing account to this Google identity
                user.googleId = googleId;
                user.isVerified = true;
                if (user.authProvider !== 'local' || !user.password) {
                    user.authProvider = 'google';
                }
                await user.save();
            }
        }

        if (!user) {
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                googleId,
                authProvider: 'google',
                isVerified: true,
            });
        }

        await applyAdminEmail(user);

        const token = generateToken(user._id);
        user.password = undefined;

        return res.status(200).json({ message: "Logged in with Google successfully", token, user });
    } catch (error) {
        return res.status(400).json({ message: error.message || "Google authentication failed" });
    }
}

//controller for getting user by id
//GET: /api/users/data
export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;
        //check user exists
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //return user
        user.password = undefined;
        return res.status(200).json({ user })

    } catch (error) {
        return res.status(400).json({ message: error.message })

    }
}

// controller for getting user resumes
// GET: /api/users/resumes
export const getUserResumes = async(req, res)=>{
    try {
        const userId = req.userId;
        //return user resumes
        const resumes = await Resume.find({userId})
        return res.status(200).json({resumes})
    } catch (error) {
        return res.status(400).json({message:error.message})

    }
}

// GET: /api/users/count
export const getUserCount = async (req, res) => {
    try {
        const count = await User.countDocuments({});
        return res.status(200).json({ count });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Controller for forgot password
// POST: /api/users/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 min
  await user.save();

  const resetLink = `${CLIENT_URL}/reset-password/${token}`;

  // Send email (example below)
  await sendEmail(user.email, resetLink, "Reset your password - Prime Resume AI");

  res.json({ msg: "Reset link sent to email" });
};


// Controller for reset password
 // POST: /api/users/reset-password/:token

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;

  await user.save();

  res.json({ msg: "Password reset successful" });
};

// Controller for verifying a user's email via the link sent on signup
// GET: /api/users/verify-email/:token
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification link" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();
    await applyAdminEmail(user);

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller for resending the verification email (e.g. if the original expired
// or landed in spam). Requires the user to be logged in.
// POST: /api/users/resend-verification
export const resendVerificationEmail = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    user.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const verifyLink = `${CLIENT_URL}/verify-email/${verificationToken}`;
    await sendEmail(
      user.email,
      verifyLink,
      "Verify your email - Prime Resume AI",
      `<h3>Verify your email</h3><p>Click below to verify your Prime Resume AI account:</p><a href="${verifyLink}">${verifyLink}</a><p>This link expires in 24 hours.</p>`
    );

    return res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
