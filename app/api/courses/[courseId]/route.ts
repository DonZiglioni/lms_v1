import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

import Mux from '@mux/mux-node'
import { isTeacher } from "@/lib/teacher"

const MUX = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET
})

export const DELETE = async (
    req: Request,
    { params }: { params: { courseId: string } }
) => {
    try {
        let user = await currentUser()
        const userId = user?.id
        const { courseId } = await params

        if (!userId || !isTeacher(userId)) {
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
                        muxData: true,
                    }
                }
            },
        })

        if (!course) {
            return new NextResponse("Not Found", { status: 404 })
        }

        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                await MUX.video.assets.delete(chapter.muxData.assetId)
            }
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: courseId
            }
        })
        return NextResponse.json(deletedCourse)
    } catch (error) {
        console.log("[DELETE_COURSE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}


export const PATCH = async (
    req: Request,
    { params }: { params: { courseId: string } }
) => {
    try {
        let user = await currentUser()
        const userId = user?.id
        const { courseId } = await params
        const values = await req.json()
        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const course = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                ...values,
            }
        })

        return NextResponse.json(course)
    } catch (error) {

        console.log("[COURSES]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}