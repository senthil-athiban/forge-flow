export interface ErrorResponse {
    message: string;
    status: number;
    code?: string;
}

class ApiError extends Error {
    status: number;
    code?: string;

    constructor(message: string, status: number, code: string) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

export default ApiError;