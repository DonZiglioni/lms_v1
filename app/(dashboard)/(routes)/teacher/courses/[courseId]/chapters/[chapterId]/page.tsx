import React from 'react'
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react'
import { IconBadge } from '@/components/IconBadge'
import ChapterTitleForm from './_components/ChapterTitleForm'
import ChapterDescriptionForm from './_components/ChapterDescriptionForm'
import ChapterAccessForm from './_components/ChapterAccessForm copy'
import ChapterVideo from './_components/ChapterVideoForm'
import ChapterVideoForm from './_components/ChapterVideoForm'
import Banner from '@/components/Banner'
import ChapterActions from '../../_components/ChapterActions'


const ChapterIdPage = async ({ params }: {
    params: Promise<{ courseId: string; chapterId: string }>
}) => {
    const { courseId, chapterId } = await params
    const user = await currentUser()
    const userId = user?.id

    if (!userId) {
        return redirect('/')
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: chapterId,
            courseId: courseId,
        },
        include: {
            muxData: true,
        }
    })

    if (!chapter) {
        return redirect('/')
    }

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl
    ]

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length

    const completionText = `(${completedFields}/${totalFields})`

    let isComplete = requiredFields.every(Boolean)

    if (chapter.isSection) {
        isComplete = true
    }

    // ADDED FOR INITIAL STRUCTURE - DISABLE THE FIELD REQUIREMENTS
    let isTesting = true;
    if (isTesting) {
        isComplete = true;
    }

    return (
        <>
            {!chapter.isPublished && (
                <Banner variant={"warning"} label={"This chapter is unpublished.  It will not be visible in the course."} />
            )}
            <div className='p-6'>
                <div className='flex items-center justify-between'>
                    <div className='w-full'>
                        <Link href={`/teacher/courses/${courseId}`} className='flex items-center text-sm hover:opacity-75 transition mb-6'>
                            <ArrowLeft className='h-4 w-4 mr-2' />
                            Back to course setup
                        </Link>
                        <div className='flex items-center justify-between w-full'>
                            <div className='flex flex-col gap-y-2'>
                                <h1 className='text-2xl font-medium'>
                                    Chapter Creation
                                </h1>
                                <span className='text-sm text-slate-700'>
                                    Complete All Fields {completionText}
                                </span>
                            </div>
                            <ChapterActions
                                disabled={!isComplete}
                                courseId={courseId}
                                chapterId={chapterId}
                                isPublished={chapter.isPublished}

                            />
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                    <div className='space-y-4'>
                        <div>
                            <div className='flex items-center gap-x-2'>
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className='text-xl'>
                                    Customize your chapter
                                </h2>
                            </div>
                            <ChapterTitleForm
                                initialData={chapter}
                                courseId={courseId}
                                chapterId={chapterId}
                            />
                            <ChapterDescriptionForm
                                initialData={chapter}
                                courseId={courseId}
                                chapterId={chapterId}
                            />
                        </div>
                        <div>
                            <div className='flex items-center gap-x-2'>
                                <IconBadge icon={Eye} />
                                <h2 className='text-xl'>
                                    Access Settings
                                </h2>
                            </div>
                            <ChapterAccessForm
                                initialData={chapter}
                                courseId={courseId}
                                chapterId={chapterId}
                            />
                        </div>
                    </div>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={Video} />
                            <h2 className='text-xl'>
                                Add a Video
                            </h2>
                        </div>
                        <ChapterVideoForm
                            initialData={chapter}
                            courseId={courseId}
                            chapterId={chapterId}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChapterIdPage