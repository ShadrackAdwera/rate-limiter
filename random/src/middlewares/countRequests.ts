import { HttpError, initRedis } from '@adwesh/common';
import { Request, Response, NextFunction } from 'express';
import moment from 'moment';

/* 
-- Rate limiter allows 5 requests per minute ---
1. Get user id from request
2. Check if id exists in redis
3. If it does not, add the userId to redis, set startTime to current time and count to 1 and allow the request, 
4. If it does, find record, if current time - start time >= 1 minute set start time to current time and count to 1 then allow the request
5. If currentTime - startTime < 1, count <= 5, increase counter and let request pass otherwise reject request with 429
*/

interface IUserRedis {
  userId: string;
  startTime: number;
  count: number;
}

const getMinutes = (currentTime: number, startTime: number): number => {
  return (currentTime - startTime) / 60000;
};

export const countAndLimitRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.userId;
  if (!userId) return next(new HttpError('Auth failed', 401));

  const userRedisData = await initRedis.client.get(userId);
  const data: IUserRedis = {
    userId,
    startTime: new Date().getTime(),
    count: 1,
  };
  if (userRedisData) {
    const storedData: IUserRedis = JSON.parse(userRedisData);
    // if for some reason the start time is greater than 1 minute reset counter and continue
    if (getMinutes(new Date().getTime(), data.startTime) >= 1) {
      await initRedis.client.set(userId, JSON.stringify(data));
    } else {
      if (storedData.count > 5) {
        // emit event to worker service?
        return next(
          new HttpError("Too many requests, you're being throttled", 429)
        );
      } else {
        await initRedis.client.set(
          userId,
          JSON.stringify({ ...data, count: storedData.count + 1 })
        );
        next();
      }
    }
  } else {
    await initRedis.client.set(userId, JSON.stringify(data), { EX: 60 });
    next();
  }
};
