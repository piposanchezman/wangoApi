import jwt from "jsonwebtoken"
import { auth } from "express-oauth2-jwt-bearer"
import { NextFunction, Request, Response } from "express"
export const jwtCheck = auth({
  audience: "http://localhost:5000/",
  issuerBaseURL: "https://dev-kllowhtqsd8qirzp.us.auth0.com/",
  tokenSigningAlg: "RS256",
})
declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string
        email: string
      }
    }
  }
}

export class MiddlewareController {
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization
    if (!authToken) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    const token = authToken.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    try {
      const decoded = jwt.decode(token) as { sub: string; iat: number }
      if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" })
      }
      ;(req as any).user = {
        sub: decoded.sub,
        iat: decoded.iat,
      }
      return next()
    } catch (error) {}

    jwtCheck(req, res, next)
  }
}
