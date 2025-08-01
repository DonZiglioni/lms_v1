import { db } from "@/lib/db"
import { isTeacher } from "@/lib/teacher"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    try {
        let user = await currentUser()
        const userId = user?.id

        const { title } = await req.json()

        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const course = await db.course.create({
            data: {
                userId,
                title,
            }
        })

        return NextResponse.json(course)
    } catch (error) {
        console.log("[COURSES]", error)
        return new NextResponse("Internal Error", { status: 500 })

    }
}