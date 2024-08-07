import User from "../model/UserMode";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";

export const jwtAuthentication = async () => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "unuauthorize request");
    }
    const decodeToken = jwt.verify(token, process.env.AcessToken);
    const user = await User.findById(decodeToken._id).select(
      "-password - refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
};
