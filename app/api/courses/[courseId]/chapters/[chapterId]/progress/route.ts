import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export const PUT = async (
    req: Request,
    { params }: { params: Promise<{ courseId: string, chapterId: string }> }
) => {
    try {
        let user = await currentUser()
        const userId = user?.id
        const { courseId, chapterId } = await params
        const { isCompleted } = await req.json()


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId: userId,
                    chapterId: chapterId,
                }
            },
            update: {
                isCompleted
            },
            create: {
                userId: userId,
                chapterId: chapterId,
                isCompleted: isCompleted,
            }
        })

        return NextResponse.json(userProgress)
    } catch (error) {
        console.log("[CHAPTER_ID_PROGRESS]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}