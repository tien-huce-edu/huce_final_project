class ErrorHandler extends Error {
    statusCode: Number
    constructor(massage: any, statusCode: Number) {
        super(massage)
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }
}
export default ErrorHandler
