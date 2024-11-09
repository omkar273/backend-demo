class ApiResponse {
    constructor(data, message, status = 200) {
        this.status = status;
        this.data = data;
        this.message = message;
        this.success = true;
    }
}