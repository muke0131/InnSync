exports.errorMiddleware = (err, req, res, next) => {
    console.error(err);
  
    const statusCode = err.statusCode || 500;
    const message = err.message || 'An unexpected error occurred';
  
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };