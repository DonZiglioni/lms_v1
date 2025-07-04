import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"


export const PATCH = async (
    req: Request,
    { params }: { params: { courseId: string } }
) => {
    try {
        let user = await currentUser()
        const userId = user?.id
        const { courseId } = await params

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })

        if (!course) {
            return new NextResponse("Not Found", { status: 404 })
        }

        const unpublishedCourse = await db.course.update({
            where: {
                id: courseId,
                userId,
            },
            data: {
                isPublished: false
            }
        })

        return NextResponse.json(unpublishedCourse)
    } catch (error) {

        console.log("[COURSE UNPUBLISH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}