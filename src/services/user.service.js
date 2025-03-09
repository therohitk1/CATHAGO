import { Op } from "sequelize";
import User from "../models/user.model.js";

const createUser = async (userData) => {
  return await User.create(userData);
};

const findUser = async (user) => {
  return await User.findOne({
    where: {
      [Op.or]: [{ email: user }, { username: user }],
    },
  });
};

const findUserById = async (userId) => {
  return await User.findByPk(userId);
};

const updateUser = async (userId, updateData) => {
  // Fixed the where clause to use id instead of userId
  await User.update(updateData, { where: { id: userId } });
  return findUserById(userId);
};

const deleteUser = async (userId) => {
  // Fixed the where clause to use id instead of userId
  return await User.destroy({ where: { id: userId } });
};

const restoreUser = async (userId) => {
  // Fixed the where clause to use id instead of userId
  return await User.restore({ where: { id: userId } });
};

const generateAccessAndRefreshToken = async (userId) => {
  const user = await findUserById(userId);
  
  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

export {
  createUser,
  findUser,
  findUserById,
  updateUser,
  deleteUser,
  restoreUser,
  generateAccessAndRefreshToken
};