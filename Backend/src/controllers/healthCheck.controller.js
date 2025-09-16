import apiSuccess from "../utils/errors/apiSuccess.js";
import asyncHandler from "../utils/helpers/asyncHandler.js";

export const checkHealth = asyncHandler(async (_, res) => {
  res.status(200).json(new apiSuccess(200, "Health check passed"));
});
