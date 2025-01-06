const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");  // Ensure mongoose is required

const accessChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;

   
    if (!userId) {
        console.log('User ID is not sent with request');
        return res.status(400).json({ message: "User ID not provided" });
    }

   
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID format" });
    }

    try {
        
        var isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },  
                { users: { $elemMatch: { $eq: userId } } }         
            ]
        })
            .populate("users", "-password")
            .populate("latestMessage");

       
        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email"
        });

        
        if (isChat.length > 0) {
            return res.status(200).send(isChat[0]);
        } else {
          
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId]
            };

            const createdChat = await Chat.create(chatData);

         
            const fullChat = await Chat.findOne({ _id: createdChat._id })
                .populate("users", "-password");

          
            return res.status(200).json(fullChat);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error", error: err.message });
    }
});


const fetchChats = expressAsyncHandler(async (req, res) => {
    try {
        const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        const populatedResults = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email"
        });

        res.status(200).json(populatedResults);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Internal server error" });
    }
});


const createGroupChat=expressAsyncHandler(async(req,res)=>{
    if(!req.body.users||!req.body.name){
        return res.status(400).send({message:"Please Fill All the Details"});
    }
    var users = JSON.parse(req.body.users);
    if(users.length<2){
        return  res.status(400).send({message:"More than 2 users are required to form group chat"});
    }
    users.push(req.user);

    try{
        const groupChat =await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user,
        });

        const fullGroupChat= await Chat.findOne({_id:groupChat._id})
        .populate('users','-password')
        .populate("groupAdmin",'-password');

        res.status(200).json(fullGroupChat);
    }catch(error){

    }

});

const renameGroup = expressAsyncHandler(async(req,res)=>{
    const {chatId,chatName}=req.body;
    const updatedChat =await Chat.findByIdAndUpdate(
        chatId,
        {chatName},
        {new :true}
    ).populate("users","-password")
    .populate("groupAdmin","-password");

    if(!updatedChat){
        res.status(404);
        throw new Error("Chat Not Found");
    }else{
        res.json(updatedChat);
    }
});

const addToGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // Check if the chatId and userId are provided
    if (!chatId || !userId) {
        return res.status(400).json({ message: "chatId and userId are required" });
    }

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $push: { users: userId } },  // Add user to the users array
            { new: true }
        )
        .populate('users', '-password')  // Populate users without passwords
        .populate('groupAdmin', '-password');  // Populate groupAdmin without password

        if (!updatedChat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Send the updated chat back to the client
        res.status(200).json(updatedChat);
    } catch (error) {
        console.error("Error adding user to group:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const removeFromGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // Check if chatId and userId are provided
    if (!chatId || !userId) {
        return res.status(400).json({ message: "chatId and userId are required" });
    }

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $pull: { users: userId } },  // Remove user from the users array
            { new: true }
        )
        .populate('users', '-password')  // Populate users without passwords
        .populate('groupAdmin', '-password');  // Populate groupAdmin without password

        if (!updatedChat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Send the updated chat back to the client
        res.status(200).json(updatedChat);
    } catch (error) {
        console.error("Error removing user from group:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = { accessChat,fetchChats ,createGroupChat,renameGroup,addToGroup,removeFromGroup};
