import logger from "../utils/logger.js";

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error('Error:', err);

  // Preserve data property if it exists
  if (err.data) {
    error.data = err.data;
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const validationErrors = (err.errors || []).map(errItem => ({
      field: errItem.path,
      message: errItem.message
    }));
    error = {
      statusCode: 400,
      message: 'Validation Error',
      errors: validationErrors,
      data: err.data || error.data
    };
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    // Provide more specific error message based on the constraint
    let message = 'Duplicate field value entered';
    
    if (err.errors && err.errors.length > 0) {
      const constraint = err.errors[0].path;
      const field = err.errors[0].path;
      
      if (constraint === 'breed_id' || field === 'breed_id') {
        message = 'This breed preference already exists';
      } else if (constraint === 'pet_preferences_id' || field === 'pet_preferences_id') {
        message = 'Pet preference already exists';
      }
    }
    
    error = {
      statusCode: 400,
      message,
      data: err.data || error.data
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      statusCode: 401,
      message: 'Invalid token',
      data: err.data || error.data
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      statusCode: 401,
      message: 'Token expired',
      data: err.data || error.data
    };
  }

  // Sequelize database connection error
  if (err.name === 'SequelizeConnectionError') {
    error = {
      statusCode: 500,
      message: 'Database connection error',
      data: err.data || error.data
    };
  }

  // Multer upload errors (e.g. LIMIT_FILE_SIZE)
  if (err.name === 'MulterError') {
    error = {
      statusCode: 400,
      message: err.message || 'File upload error',
      data: err.data || error.data
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(error.errors && { errors: error.errors }),
    ...(error.data && { data: error.data }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 handler
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: error.message
  });
};