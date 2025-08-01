import getChapter from '@/actions/getChapter';
import Banner from '@/components/Banner';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import VideoPlayer from './_components/VideoPlayer';
import CourseEnrollButton from './_components/CourseEnrollButton';
import { Separator } from '@/components/ui/separator';
import Preview from '@/components/Preview';
import { File } from 'lucide-react';
import CourseProgressButton from './_components/CourseProgressButton';
import CancelSubButton from './_components/CancelSubButton';

const ChapterIdPage = async ({ params }: {
    params: Promise<{
        courseId: string;
        chapterId: string;
    }>
}) => {
    let user = await currentUser()
    const userId = user?.id
    const { courseId, chapterId } = await params
    if (!userId) {
        return redirect('/')
    }

    const {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase,
    } = await getChapter({
        userId,
        chapterId: chapterId,
        courseId: courseId,
    })

    if (!chapter || !course) {
        return redirect('/')
    }

    const isSubscribed = courseId === '01c8bde5-2172-44d9-a85d-e58837f1d505' && purchase;
    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;


    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner
                    variant={'success'}
                    label='You already completed this chapter.'
                />
            )}
            {isLocked && (
                <Banner
                    variant={'warning'}
                    label='You need to purchase this course to watch this chapter.'
                />
            )}
            <div className='flex flex-col max-w-4xl mx-auto pb-20'>
                <div className='p-4'>
                    <VideoPlayer
                        chapterId={chapterId}
                        title={chapter.title}
                        courseId={courseId}
                        nextChapterId={nextChapter?.id}
                        playbackId={muxData?.playbackId!}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd}
                    />
                </div>
                <div>
                    <div className='p-4 flex flex-col md:flex-row items-center justify-between'>
                        <h2 className='text-2xl font-semibold mb-2'>
                            {chapter.title}
                        </h2>
                        {purchase ? (
                            <>
                                {isSubscribed && (
                                    <CancelSubButton
                                        courseId={courseId}
                                    />
                                )}

                                <CourseProgressButton
                                    chapterId={chapterId}
                                    courseId={courseId}
                                    nextChapterId={nextChapter?.id}
                                    isCompleted={!!userProgress?.isCompleted}
                                />
                            </>
                        ) : (
                            <CourseEnrollButton
                                courseId={courseId}
                                price={course.price!}
                            />
                        )}
                    </div>
                    <Separator />
                    <div>
                        <Preview value={chapter.description!} />
                    </div>
                    {!!attachments.length && (
                        <>
                            <Separator />
                            <div className='p-4'>
                                {attachments.map((attachment) => (
                                    <a
                                        href={attachment.url}
                                        target='_blank'
                                        key={attachment.id}
                                        className='flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline'
                                    >
                                        <p className='line-clamp-1'>
                                            <File />
                                            {attachment.name}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChapterIdPage