import { http, HttpRequest } from "@architect/functions";
import HttpError from "node-http-error";
import { decode } from "jwt-simple";

const { JWT_PRIVATE_KEY } = process.env;

export const verifyAuth = async (req: HttpRequest) => {
  if (!req.headers.authorization) {
    throw HttpError(401, "Missing authorization header");
  }
  try {
    const token = req.headers.authorization.split(" ").pop();
    const decoded = decode(token, JWT_PRIVATE_KEY);

    if (!decoded.user_id) {
      throw HttpError(400, "Invalid token given, no user_id in payload");
    }
    return parseInt(decoded.user_id) as number;
  } catch (error) {
    throw HttpError(401, "Invalid token");
  }
};
