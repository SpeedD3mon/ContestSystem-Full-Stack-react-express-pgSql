export const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  if (process.env.NODE_ENV !== 'production') {
    return res.status(500).json({ message: err.message, stack: err.stack });
  }
  res.status(500).send('Something went wrong!');
};
