import { Request, Response } from "express";
import { Session } from "express-session";

export interface resContext {
  req: Request & { session?: Session & { userId?: string } }; //& { session?: Express.Session};
  res: Response;
  payload?: { userId: string };
}
