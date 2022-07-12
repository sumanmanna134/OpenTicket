import express, { Request, Response } from 'express';
const router = express.Router();
const health = (req: Request, res: Response) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  try {
    res.status(200).json({
      message: 'OK',
      requestIp: ip,
    });
  } catch (err) {
    return res.status(502).json({ message: err });
  }
};
router.get('/api/orders/health', health);
export { router as healthRouter };
