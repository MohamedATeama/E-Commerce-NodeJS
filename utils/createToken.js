import jwt from 'jsonwebtoken'

export const createToken = (id, role) =>
  jwt.sign({ _id: id, role }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRE })

export const createResetToken = (id) =>
  jwt.sign({ _id: id }, process.env.JWT_KEY, { expiresIn: process.env.JWT_RESET_EXPIRE })