import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";


// here we are using named export because we have multiple functions to export from this file



export const getUsersForSidebar = async (req, res) => {

    try {
        const loggedInUserId = req.user._id;     // logged in user id

        // get all users except the logged in user selecting only username and profilePic fields
        // console.log("iiihuh")
         const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        //  console.log(filteredUsers);


        res.status(200).json(filteredUsers);
    } catch (error) { console.log(error.message); }
}

export const getMessages = async (req, res) => {

    try {
        const { id: userToChatId } = req.params;   // id of user to chat with

        const myId = req.user._id; // logged in user id

        // get all messages between the two users
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 }); // Sort messages by creation time in ascending order   



        res.status(200).json(messages);

    } catch (error) { console.log(error.message); }
}

export const sendMessage = async (req, res) => {

    try {
        const { text, image } = req.body; // text and image urlfrom req body

        const { id: receiverId } = req.params; // id of user to whom message is sent

        const senderId = req.user._id; // logged in user id

        if (!text && !image) {
            return res.status(400).json({ message: "Message cannot be empty" });
        }




        // if (image) {
        //     // upload image to cloudinary
            
        //     const uploadedImage = await cloudinary.uploader.upload(image);
        //     console.log("Cloudinary upload result:", uploadedImage);
        //     const imageUrl = uploadedImage.secure_url;

        //     console.log(imageUrl)
        //     // create new message     

        //     const newMessage = new Message({
        //         senderId,
        //         receiverId,
        //         text,
        //         image: imageUrl
        //     });
        //     console.log(newMessage)

        //     await newMessage.save();
        //     console.log("send")
        //     console.log(receiverId)

        //     // realtime functionality using socket.io
        //       const receiverSocketId = getReceiverSocketId(receiverId);
        // console.log(receiverSocketId)
        // if (receiverId) {
        //     io.to(receiverSocketId).emit("newMessage", newMessage);
        // }



        // res.status(201).json(newMessage);
          
        // }
        // else{
        const imageUrl = null;
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        console.log(newMessage)

        await newMessage.save();
        console.log("send")
        console.log(receiverId)
   
        // realtime functionality using socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        console.log(receiverSocketId);
        if (receiverId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    

    } catch (error) { console.log("error message: " + error.message); }

}