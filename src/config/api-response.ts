import { Response } from 'express';

class ApiResponse {
  public static message(
    res: Response,
    status: number,
    success: number,
    message: string | Record<string, any>,
  ): Response {
    return res.status(status).json({ success, message });
  }

  public static error(res: Response, error: string): Response {
    return res.status(500).json({ success: 0, error });
  }
}

export default ApiResponse;
