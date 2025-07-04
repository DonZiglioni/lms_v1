import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"


export const PATCH = async (
    req: Request,
    { params }: { params: { courseId: string, chapterId: string } }
) => {
    try {
        let user = await currentUser()
        const userId = user?.id
        const { courseId, chapterId } = await params


        if (!userId) {
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


        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId
            }
        })

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: chapterId
            }
        })

        if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const publishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                isPublished: true
            }
        })

        return NextResponse.json(publishedChapter)
    } catch (error) {

        console.log("[CHAPTER PUBLISH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}