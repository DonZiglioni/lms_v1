import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { isTeacher } from "@/lib/teacher"


export const POST = async (
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) => {
    try {
        let user = await currentUser()
        const userId = user?.id
        const { courseId } = await params
        const { url } = await req.json()

        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            },
        })
        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split('/').pop(),
                courseId: courseId,
            }
        })

        return NextResponse.json(attachment)
    } catch (error) {
        console.log("[COURSE_ATTACHMENTS]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}