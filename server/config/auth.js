import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.user_id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30m' }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.user_id, email: user.email, role: user.role },
    process.env.JWT_SECRET, // Use a separate secret for refresh tokens
    { expiresIn: '30m' } // Example: valid for 7 days
  );
};