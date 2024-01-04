import { asyncHandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/apiError.js"
import {User} from "../models//user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiResponse.js"

const generateAccessAndRefreshTokens = async (userId) => {
   try {
     const user = await User.findById(userId);
     const accesstoken = user.generateAccessToken();
     const refreshToen = user.generateRefreshToken();

     user.refreshToen = refreshToen;
     await user.save({validateBeforSave: false});
     return {accesstoken, refreshToen}
   } catch (error) {
      throw new ApiError(500, 'Something went wrong while generation refresh and access token')
   }
}

const registerUser = asyncHandler( async(req, res) => {
   //get user details from frontend
   //add validation- not empty
   //check if user already exist (username and email)
   //check for images, check for avatar
   //upload them to cloudinary, avatar
   //create user object - create entry in db
   //remove password and refresh token from response
   //check for user creation
   //return response if not success send error response

   const {username, fullName, email, password}= req.body;
   // if(fullName === ""){
   //    throw new ApiError(400, "fullname is required")
   // }
   if(
      [fullName, email, username, password].some((field)=> field?.trim() === "")
   ){
      throw new ApiError(400, "all fields are required")
   }

   const existedUser = await User.findOne({
      $or: [{ username }, { email }]
  })

  if (existedUser) {
      throw new ApiError(409, "User with email or username already exists")
  }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   if(!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
     }
     const coverImageLocalPath = req.files?.coverImage[0]?.path;
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   let coverImage;
   if(coverImageLocalPath){
     coverImage = await uploadOnCloudinary(coverImageLocalPath)
   }
   if(!avatar){
      throw new ApiError(400, "Avatar file is required");
   }

   //store in db
  const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()
   })
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );
   if(!createdUser){
      throw new ApiError(500, "Something went wrong while registering the user")
   }

   return res.status(201).json(
      new ApiResponse(200, createdUser, "User registerd Successfully")
   )

})

const loginUser = asyncHandler(async(req, res)=>{
   //get input from user like username and password
   //usernameor email for check login
   //find the user
   //if user then password check
   //if password correct create access and refresh token
   //send cookie these token and send response success login

   const {email, username, password} = req.body;

   if(!username || !email) {
      throw new ApiError(400, "username or email is required");
   }

  const user = await User.findOne({
      $or: [{username}, {email}]
   })

   if(!user){
      throw new ApiError(404, 'user does not exist')
   }

   const ispasswordValid = await user.isPasswordCorrect(password);
   if(!ispasswordValid){
      throw new ApiError(401, 'Invalid user credentials')
   }

 const {accesstoken, refreshToen} = await generateAccessAndRefreshTokens(user._id);
   
 const loggedinUser = await User.findById(user._id).select("-password -refreshToken");

 const options = {
   httpOnly: true,
   secure: true,
 }

 return res
 .status(200)
 .cookie("accesstoken", accesstoken, options)
 .cookie("refreshToen", refreshToen, options)
 .json(
   new ApiResponse(
      200, 
      {
         user: loggedinUser, accesstoken, refreshToen 
      },
      "User logged in successfully!"
   )
 )
});

const loggedOut = asyncHandler(async(req, res)=> {
   //clear cookies
   //remove refresh token from database

   User.findById
})
export {
   registerUser,
   loginUser
};