const asyncHandler = (requestHandler) => {
      return (req, res, next) => {
         Promise.resolve(requestHandler(req, res, next)).catch((error) => {
            console.error("Error in async handler:", error);
            next(error);
         });
      };
};

export { asyncHandler };