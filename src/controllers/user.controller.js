import { asyncHandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/apiError.js"
import {User} from "../models//user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiResponse.js"

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

  const existedUser = User.findOne({
      $or: [{ username },{ email }]
   })
   if(existedUser){
      throw new ApiError(409, "user with email or username already exists")
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   if(!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
     }
     const coverImageLocalPath = req.files?.coverImage[0]?.path;
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   if(coverImageLocalPath){
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
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

export {registerUser};