import express from 'express';
import { currentUser, NotFoundError } from '@offlix-org/common';
import { requireAuth } from '@offlix-org/common';
const router = express();

router.get('/api/users/currentuser', currentUser, requireAuth, (req, res) => {
  if (isValidUrl(req.url)) {
    return res.send({ currentUser: req.currentUser });
  } else {
    throw new NotFoundError();
  }
});

const isValidUrl = (url: string): boolean => {
  if (url.includes('?')) {
    return false;
  }
  return true;
};

export { router as currentUserRouter };
