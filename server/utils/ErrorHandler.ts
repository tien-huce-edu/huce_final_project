class ErrorHandler extends Error {
    statusCode: number
    constructor(massage: any, statusCode: number) {
        super(massage)
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }
}
export default ErrorHandler
