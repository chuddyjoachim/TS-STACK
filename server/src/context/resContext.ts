import { Request, Response } from "express";

export interface resContext {
  req: Request;
  res: Response;
  payload?: { userId: string };
}
