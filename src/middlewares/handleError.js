import { CustomError } from "../errors/customErrors.js";

export const handleError = (error, req, res, next) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  return res
    .status(500)
    .json({ message: "Something went wrong, please try again!" });
};
