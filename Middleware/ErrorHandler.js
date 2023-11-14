 const ErrorHandler = (error, req, res, next) => {
    const errorStatus = error.status || 500;
    const errorMessage = error.message || "unknown error";
    return res.status(errorStatus).json({
      message: errorMessage,
      status: errorStatus,
      stack: error.stack,
      name: error.name,
    });
  };
  /**
   * EXPORT ERRORHANDLER
   */
module.exports ={
  ErrorHandler
}