import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"


export const POST = async (
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) => {
    try {
        let user = await currentUser()
        const userId = user?.id
        const { courseId } = await params
        const { title, isSection } = await req.json()
        console.log("IS SECTION:", isSection);


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

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: courseId,
            },
            orderBy: {
                position: 'desc'
            }
        })

        const newPosition = lastChapter ? lastChapter.position + 1 : 1

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId: courseId,
                position: newPosition,
                isSection: isSection,
            }
        })

        return NextResponse.json(chapter)
    } catch (error) {
        console.log("[CHAPTERS]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}