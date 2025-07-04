"use client"
import { useAuth } from "@clerk/nextjs"

const getAuth = async () => {
    const authe = useAuth()
    console.log(authe)
    const userId = authe.userId
    console.log(userId)
    return userId
}

export default getAuth