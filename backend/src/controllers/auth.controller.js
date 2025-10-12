import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

// here we are using named export because we have multiple functions to export from this file

export const signup = async (req, res) => {

    try {
        // get data from req body
        const { email, username, password } = req.body;

        // validation
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        if( !email || !username || !password ){
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: "Username already taken" });
        }


        // password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const newUser = new User({
            email, username, password: hashedPassword
        });

         if(!newUser){
            return res.status(400).json({ message: "User data is not valid" });
         } 
         else{
            //generate jwt token
            generateToken(newUser._id,res  );

            // save user
            await newUser.save();

            // send response
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
         }
        
    } catch (error) {
        console.log(
            `Error in signup controller: ${error.message}`
        );
        
        res.status(500).json({ message: "Internal server error", error });
    }
}

export const login = async (req, res) => {
   try {
    // get data from req body
    const { email, password } = req.body;

    // validation
    if( !email || !password ){
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }

    // compare hashed password
    const isPwCorrect = await bcrypt.compare(password, user.password);


    if (!isPwCorrect) {
        return res.status(400).json({ message: "User does not exist" });
    }
   
    // generate jwt token
    generateToken(user._id, res);

    // send response
    res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
    });

   } catch (error) {
       console.log(
           `Error in login controller: ${error.message}`
       );
       res.status(500).json({ message: "Internal server error", error });
   }
}

export const logout = (req, res) => {
    try {
        // clear jwt cookie
        res.clearCookie("jwt", "", {
            maxAge: 0,
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log(
            `Error in logout controller: ${error.message}`
        );
        res.status(500).json({ message: "Internal server error", error });
    }
}

export const updateProfilePic = async (req, res) => {
    try {
        // get data from req body
        const { profilePic } = req.body;

        // get user id from req.user from auth middleware
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }
     
        // upload image to cloudinary
       const uploadResult = await cloudinary.uploader.upload(profilePic);

         if (!uploadResult) {
            return res.status(500).json({ message: "Image upload failed" });
            }
 
         // update user profile pic in db and return updated user data except password
       const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResult.secure_url }, { new: true }).select('-password');

       if (!updatedUser) {
           return res.status(404).json({ message: "User not found" });
       }  
       res.status(200).json(updatedUser);

        
    } catch (error) {
        console.log(
            `Error in updateProfilePic controller: ${error.message}`
        );
        res.status(500).json({ message: "Internal server error", error });
    }
}

export const checkAuth = (req, res) => {
    try {

        // get user id from req.user from auth middleware
        console.log("inside")
        const userId = req.user._id;
        if(userId){
            res.status(200).json({user: req.user });
        }
  
        else{
            console.log("else")
            return false;

        }   
    
        
    } catch (error) {
        console.log(
            `Error in checkAuth controller: ${error.message}`
        );
        res.status(500).json({ message: "Internal server error", error });
    }
}
