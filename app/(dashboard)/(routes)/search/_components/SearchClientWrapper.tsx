'use client'

import { useEffect, useState, Suspense } from 'react'
import Categories from './Categories'
import CoursesList from '@/components/CoursesList'
import getCourses, { CourseWithProgressWithCategory } from '@/actions/getCourses'
import { Category } from '@prisma/client'

interface Props {
    userId: string
    categories: Category[]
    searchParams: {
        title?: string
        categoryId?: string
    }
}

const SearchClientWrapper = ({ userId, categories, searchParams }: Props) => {
    const [courses, setCourses] = useState<CourseWithProgressWithCategory[]>([])

    useEffect(() => {
        const fetchCourses = async () => {
            const result = await getCourses({
                userId,
                title: searchParams.title,
                categoryId: searchParams.categoryId,
            })
            setCourses(result)
        }
        fetchCourses()
    }, [searchParams.title, searchParams.categoryId, userId])

    return (
        <div className='p-6 space-y-4'>
            <Suspense fallback={<div>Loading filters...</div>}>
                <Categories items={categories} />
            </Suspense>
            <CoursesList items={courses} />
        </div>
    )
}

export default SearchClientWrapper