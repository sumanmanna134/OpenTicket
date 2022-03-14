import express, { Request, Response } from 'express';
const router = express.Router();

const greet = (req: Request, res: Response) => {
  res.status(200).json({
    headers: req.headers,
    params: req.params,
  });
};
router.get('/api/tickets/greet', greet);
export { router as greetRouter };
