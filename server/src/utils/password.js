import bcrpyt from "bcryptjs"
import { plugin } from "mongoose";


const SALT_ROUNDS = 10;


export async function hashPassword(plainPassword) {
    return bcrpyt.hash(plainPassword, SALT_ROUNDS)
}

export async function comparePassword(plainPassword, passwordHash) {
    return bcrpyt.compare(plainPassword, passwordHash)
}

