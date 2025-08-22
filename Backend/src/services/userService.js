import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const validatePassword = async (passwordFromReq, passwordFromDB) => {
  return await bcrypt.compare(passwordFromReq, passwordFromDB);
};

export const generateAccessToken = function (user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role : user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export async function saveRefreshToken(userId, token) {
  return prisma.user.update({
    where: { id: userId },
    data: { refreshToken: token },
  });
}

export const sanitizeUser = (user) => {
  const { passwordHash, refreshToken, ...safeUser } = user;
  return safeUser;
};