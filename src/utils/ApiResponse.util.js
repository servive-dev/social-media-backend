class ApiResponse {
    constructor(statusCode,  data = null ,message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400; // Consider any status code below 400 as success
    }
}

export { ApiResponse };