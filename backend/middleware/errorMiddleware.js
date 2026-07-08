const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // Use the status code set before throwing, default to 500
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Map common Supabase/PostgreSQL error codes to readable messages
  let message = err.message || 'Internal Server Error';

  if (err.code === '23505') message = 'A record with that value already exists';
  if (err.code === '23503') message = 'Referenced record does not exist';
  if (err.code === '42501') message = 'Permission denied';
  if (err.code === 'PGRST116') message = 'No record found';

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

export { notFound, errorHandler };
