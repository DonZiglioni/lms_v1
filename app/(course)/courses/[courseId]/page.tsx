import React from 'react'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'


const CourseIdPage = async ({ params }: {
    params: Promise<{ courseId: string }>
}) => {
    const param = await params
    const courseId = param.courseId
    const course = await db.course.findUnique({
        where: {
            id: courseId
        },
        include: {
            chapters: {
                where: {
                    isPublished: true
                },
                orderBy: {
                    position: 'asc'
                }
            }
        },
    })

    if (!course) {
        return redirect('/')
    }

    if (course.chapters[0].isSection) {
        return redirect(`/courses/${courseId}/chapters/${course.chapters[1].id}`)
    } else {
        return redirect(`/courses/${courseId}/chapters/${course.chapters[0].id}`)
    }
}

export default CourseIdPage