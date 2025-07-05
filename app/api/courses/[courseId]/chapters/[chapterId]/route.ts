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
    { params }: { params: Promise<{ courseId: string, chapterId: string }> }
) => {
    try {
        let user = await currentUser()
        const userId = user?.id
        const { courseId, chapterId } = await params

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

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId
            },
        })
        if (!chapter) {
            return new NextResponse("Not Found", { status: 404 })
        }

        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId
                }
            })
            if (existingMuxData) {
                await MUX.video.assets.delete(existingMuxData.assetId)
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                })
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: chapterId,
            }
        })

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true
            }
        })

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: courseId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(deletedChapter)
    } catch (error) {
        console.log("[CHAPTER_ID_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export const PATCH = async (
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) => {
    try {
        let user = await currentUser()
        const userId = user?.id
        const { courseId, chapterId } = await params
        const { isPublished, ...values } = await req.json()
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

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                ...values,
            }
        })

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId,
                }
            })

            if (existingMuxData) {
                await MUX.video.assets.delete(existingMuxData.assetId)
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                })
            }

            const asset = await MUX.video.assets.create({
                inputs: [
                    { url: values.videoUrl }
                ],
                playback_policy: ["public"],
                test: false,
            })

            await db.muxData.create({
                data: {
                    chapterId: chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,
                }
            })
        }

        return NextResponse.json(chapter)
    } catch (error) {
        console.log("[CHAPTER TITLE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}