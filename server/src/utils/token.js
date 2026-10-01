import jwt from '"jsonwebtoken'

import { env } from "../config/env"


export function signToken (user) {
    return jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role},
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn }
    )
}


export function verifyToken(token) {
    return jwt.verify(token, env.jwtSecret)
}