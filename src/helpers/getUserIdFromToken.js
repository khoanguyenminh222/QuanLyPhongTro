import jwt from 'jsonwebtoken';

export const getUserIdFromToken = (token) => {
  const decoded = jwt.decode(token);
  if (decoded) {
    const useridfromtoken = decoded.userId;
    return useridfromtoken;
  } else {
    console.error('Invalid JWT token');
    return null;
  }
};