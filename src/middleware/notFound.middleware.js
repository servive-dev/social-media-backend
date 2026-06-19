export const notFound = (req, res) => {
   res.status(404).json({
      success: false,
      data: null,
      error: {
         code: "ROUTE_NOT_FOUND",
         message: "The requested route does not exist",
         path: req.originalUrl,
         method: req.method
      }
   });
};