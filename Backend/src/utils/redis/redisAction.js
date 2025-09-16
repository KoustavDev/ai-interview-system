import { redisClient } from "../../index.js";
import apiErrors from "../errors/apiErrors.js";

export class Cache {
  static async get(key) {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async set(key, value, ttl = 900) {
    // default 15 min
    return redisClient.set(key, JSON.stringify(value), "EX", ttl);
  }

  static async del(key) {
    return redisClient.del(key);
  }

  static async storeToken(token, userId) {
    try {
      await redisClient.set(
        `forgotPassword:token:${token}`,
        userId,
        "EX",
        15 * 60
      );
    } catch (error) {
      throw new apiErrors(500, "Failed to store token!");
    }
  }

  static async validateToken(token) {
    try {
      const userId = await redisClient.get(`forgotPassword:token:${token}`);
      if (!userId) return null;

      await redisClient.del(`forgotPassword:token:${token}`);
      return userId;
    } catch (error) {
      throw new apiErrors(500, "Failed to validating forgot password token!");
    }
  }

  static async setResetWindow(userId) {
    try {
      await redisClient.set(`reset-window:${userId}`, userId, "EX", 3 * 60);
    } catch (error) {
      console.log("Failed storing reset-window token!", error);
      throw new apiErrors(500, "Failed to storing reset-window token!");
    }
  }

  static async validateResetWindow(userId) {
    try {
      return await redisClient.exists(`reset-window:${userId}`);
    } catch (error) {
      throw new apiErrors(500, "Failed to validating reset-window token !");
    }
  }
}

// export const storeToken = async (token, userId) => {
//   try {
//     await redisClient.set(
//       `forgotPassword:token:${token}`,
//       userId,
//       "EX",
//       15 * 60
//     );
//   } catch (error) {
//     console.log("Error storing forgot password token", error);
//     throw new apiErrors(500, "Failed to store token!");
//   }
// };

// export const validateToken = async (token) => {
//   try {
//     const userId = await redisClient.get(`forgotPassword:token:${token}`);
//     if (!userId) return null;

//     await redisClient.del(`forgotPassword:token:${token}`);
//     return userId;
//   } catch (error) {
//     console.log("Error validating forgot password token", error);
//     throw new apiErrors(500, "Failed to validating forgot password token!");
//     return null;
//   }
// };

// export const setResetWindow = async (userId) => {
//   try {
//     await redisClient.set(`reset-window:${userId}`, userId, "EX", 3 * 60);
//   } catch (error) {
//     console.log("Failed storing reset-window token!", error);
//     throw new apiErrors(500, "Failed to storing reset-window token!");
//   }
// };

// Validate if reset window exists for a user
// export const validateResetWindow = async (userId) => {
//   try {
//     return await redisClient.exists(`reset-window:${userId}`);
//   } catch (error) {
//     console.log("Error validating reset-window token", error);
//     throw new apiErrors(500, "Failed to validating reset-window token !");
//     return false;
//   }
// };
