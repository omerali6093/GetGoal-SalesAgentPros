import { ZodError } from "zod";
import { ApiError } from "./error.middleware.js"


export function validate(schema, source= 'body') {
    return (req, res, next) => {
        try {
            req[source] =  schema.parse(req[source]);
            next()
        } catch (error) {
            if(error instanceof ZodError) {
                const details = error.issues.map((issue) => ({
                    field:  issue.path.join(""),
                    message: issue.message
                }))
                return next(new ApiError(400, "Validation failed", {code: "VALIDATION_ERROR", details}))
            }
            next(error)
        }
    } 
}
