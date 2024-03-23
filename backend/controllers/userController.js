import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from 'bcryptjs';
import createToken from "../utils/createToken.js";

// Create a new user
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("Please fill all the inputs.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).send("User already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({ username, email, password: hashedPassword });
  
  createToken(res, newUser._id);

  res.status(201).json({
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
  });
});

// Login user
const loginUser = asyncHandler(async(req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
    return res.status(401).send("Invalid email or password");
  }

  createToken(res, existingUser._id);

  res.status(200).json({
    _id: existingUser._id,
    username: existingUser.username,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
  });
});

// Logout user
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: "Logged out successfully" });
});

// Get all users
const getAllUsers = asyncHandler(async(req, res) => {
  const users = await User.find({});
  res.json(users);
});

// Get current user profile
const getCurrentUserProfile = asyncHandler(async(req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async(req, res)=>{
  const user = await User.findById(req.params.id)
  if(user)
  {
    if(user.isAdmin)
    {
      res.status(400)
      throw new Error('Cannot Delete ADMIN users')
    }
    await User.deleteOne({_id: user._id})
    res.json({message: "User Removed!"})

  }else{
    res.status(404)
    throw new Error('This user is not found')
  }

})

const getUserById = asyncHandler(async(req, res)=>{
  const user = await User.findById(req.params.id).select('-password')
  
  if(user){
    res.json(user)
  }else{
    res.status(404)
    throw new Error('This user Do not Exist!')
  }

})


const updateUserById = asyncHandler(async(req, res)=>{
  const user =  await User.findById(req.params.id)

    
  if(user){
    user.username =req.body.username || user.username
    user.email = req.body.email || user.email
    user.usAdmin = Boolean(req.body.isAdmin)

    const updatedUser = user.save()
   res.json({
      _id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  }else{
    res.status(404)
    throw new Error('This user Do not Exist!')
  }


}) 

export { createUser, loginUser, logoutCurrentUser, getAllUsers, getCurrentUserProfile,  updateCurrentUserProfile, deleteUserById, getUserById, updateUserById};
