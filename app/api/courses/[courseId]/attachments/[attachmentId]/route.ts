import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { isTeacher } from "@/lib/teacher"


export const DELETE = async (
    req: Request,
    { params }: { params: { courseId: string, attachmentId: string } }
) => {
    try {
        let user = await currentUser()
        const userId = user?.id
        const { courseId } = await params

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

        const attachment = await db.attachment.delete({
            where: {
                courseId: courseId,
                id: await params.attachmentId
            },
        })

        return NextResponse.json(attachment)
    } catch (error) {
        console.log("[ATTACHMENT_ID]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}