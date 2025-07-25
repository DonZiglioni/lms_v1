import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"


export const PUT = async (
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) => {
    try {
        let user = await currentUser()
        const userId = user?.id
        const { courseId } = await params
        const { list } = await req.json()

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

        for (let item of list) {
            await db.chapter.update({
                where: { id: item.id },
                data: { position: item.position }
            })
        }

        return NextResponse.json("Success", { status: 200 })
    } catch (error) {
        console.log("[REORDER]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}