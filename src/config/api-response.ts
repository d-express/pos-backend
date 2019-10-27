import { Response } from 'express';

class ApiResponse {
    constructor() {}

    public static message(res: Response, status: number, success: number, message: String | Object): Response {
        return res.status(status).json({ success, message });
    }

    public static error(res: Response, error: String): Response {
        return res.status(500).json({ success: 0, error });
    }
}

export default ApiResponse;
