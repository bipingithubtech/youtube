import ApiError from "../utils/ApiError.js";
import User from "../model/UserMode.js";
import uploadCloudinary from "../utils/Cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAcessTokenAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  const acaesstoken = user.AcessToken();
  const RefreshToken = user.generateRefreshToken();
  user.refreshToken = RefreshToken;

  await user.save({ validateBeforeSave: false });
  return { acaesstoken, RefreshToken };
};

export const resgeister = async (req, res) => {
  try {
    // Get user details from the frontend
    const { username, email, password } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existeduser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existeduser) {
      throw new ApiError(409, "User already exists");
    }

    // Access uploaded files
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }

    // Upload files to Cloudinary
    const avatar = await uploadCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath
      ? await uploadCloudinary(coverImageLocalPath)
      : null;

    if (!avatar) {
      throw new ApiError(400, "Avatar upload failed");
    }

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
    });

    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    // Respond with success
    res
      .status(200)
      .json(new ApiResponse(200, createdUser, "Successfully registered"));
  } catch (error) {
    // Handle unexpected errors
    res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};
export const Login = async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "invalid username or emial");
  }

  const isPasswordValid = await User.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "invalid password");
  }

  const { AcessToken, RefreshToken } = generateAcessTokenAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password - refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", AcessToken, options)
    .cookie("RefreshToken", RefreshToken, options)
    .json(
      new ApiResponse(200, { user: loggedInUser, AcessToken, RefreshToken })
    );
};
export const logout = async (req, res) => {
  await User.findByIdAndUpdate(
    req.User._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
};

const refectch = async (req, res) => {
  const incomingRefresToken = req.cookies.RefreshToken || req.body.RefreshToken;
  if (!incomingRefresToken) {
  }
  try {
    const decodeToken = jwt.verify(
      incomingRefresToken,
      process.env.refreshToken
    );
    const user = User.findById(decodeToken._id);
    if (!user) {
      throw new ApiError(401, "invalid refres token");
    }
    if (incomingRefresToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { AcessToken, RefreshToken } = generateAcessTokenAndRefreshToken(
      user._id
    );

    res
      .status(200)
      .cookie("accessToken", AcessToken, options)
      .cookie("RefreshToken", RefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            AcessToken,
            RefreshToken,
          },
          "Acess token refreshed"
        )
      );
  } catch {}
};
