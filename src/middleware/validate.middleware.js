import { ApiError } from "../utils/ApiError.js";

// IT'S A MIDDLEWARE TO VALIDATE THE REQUEST BODY USING ZOD SCHEMAS
export const validate = (schema) => (req, res, next) => {

   try {
      // Validate the request body against the provided schema
      schema.parse(req.body);
      next();

   } catch (error) {

      return res.status(400).json(
         new ApiError(
            400, 
            "Validation Error", 
            error.errors
         )
      )

   }

}