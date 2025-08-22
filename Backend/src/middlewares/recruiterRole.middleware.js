const recruiterRole = (req, res, next) => {
  if (req.user.role === "recruiter") next();
  else
    res.status(403).json({
      success: false,
      message: "Candidates are not allowed in this route",
    });
};

export default recruiterRole;
