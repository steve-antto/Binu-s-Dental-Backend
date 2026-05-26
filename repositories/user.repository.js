import User from '../models/user.js';

export const findUserByEmail = async (email) => User.findOne({ email: email.toLowerCase() });
export const findUserById = async (id) => User.findById(id).select('-__v');
export const findUserByFirebaseUid = async (firebaseUid) => User.findOne({ firebaseUid });
export const createUser = async (userData) => User.create(userData);
export const updateUser = async (id, updateData) => User.findByIdAndUpdate(id, updateData, { new: true }).select('-__v');
export const findUsersByRole = async (role, searchQuery = '') => {
    const query = { role };
    if (searchQuery) {
        query.$or = [
            { name: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } }
        ];
    }
    return User.find(query).select('-__v').sort({ createdAt: -1 });
};

export default { findUserByEmail, findUserById, findUserByFirebaseUid, createUser, updateUser, findUsersByRole };
