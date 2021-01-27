import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
// export type userRequest_ = {
//   user: userRequest;
// };
