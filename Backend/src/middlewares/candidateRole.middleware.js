const candidateRole = (req, res, next) => {
  if (req.user.role === "candidate") next();
  else res.status(403).json({
    success: false,
    message: "Recruiter are not allowed in this route",
  });
};

export default candidateRole;