import { getAllUsers, updateUserApproval } from '../models/User.js';

export const getAllUsers = async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
};

export const approveUser = async (req, res) => {
  const { id } = req.params;
  await updateUserApproval(id, true);
  res.json({ message: 'User approved' });
};

export const rejectUser = async (req, res) => {
  const { id } = req.params;
  await updateUserApproval(id, false);
  res.json({ message: 'User rejected' });
};