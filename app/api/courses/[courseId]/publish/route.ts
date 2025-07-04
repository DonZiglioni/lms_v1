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
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        })

        if (!course) {
            return new NextResponse("Not Found", { status: 404 })
        }

        const hasPublishedCourse = course.chapters.some((chapter) => chapter.isPublished)

        if (!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedCourse) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const publishedCourse = await db.course.update({
            where: {
                id: courseId,
                userId,
            },
            data: {
                isPublished: true
            }
        })

        return NextResponse.json(publishedCourse)
    } catch (error) {

        console.log("[COURSE PUBLISH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}