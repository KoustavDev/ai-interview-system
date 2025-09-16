import asyncHandler from "../utils/helpers/asyncHandler.js";
import apiSuccess from "../utils/errors/apiSuccess.js";
import { RecruiterService } from "../services/recruiter.service.js";


export const updateRecruiterProfile = asyncHandler(async (req, res) => {
  const { avatar, recruiterId, companyName, position, contactNumber, about } =
    req.body;

  const updatedProfile = await RecruiterService.updateProfile(
    req.user.id,
    avatar,
    recruiterId,
    companyName,
    position,
    contactNumber,
    about
  );

  return res
    .status(200)
    .json(
      new apiSuccess(
        200,
        updatedProfile,
        "Recruiter profile updated successfully"
      )
    );
});

export const recruiterDashboard = asyncHandler(async (req, res) => {
  const dashboard = await RecruiterService.dashboard(
    req.user.id,
    req.user.recruiterProfile.id
  );

  return res
    .status(200)
    .json(new apiSuccess(200, dashboard, "Dashboard information is fetched!"));
});
