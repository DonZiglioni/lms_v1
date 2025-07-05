import { db } from '@/lib/db'
import React from 'react'
import Categories from './_components/Categories'
import SearchInput from '@/components/SearchInput'
import getCourses from '@/actions/getCourses'
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from 'next/navigation'
import CoursesList from '@/components/CoursesList'
import { Suspense } from 'react'

interface SearchPageProps {
    searchParams: {
        title: string;
        categoryId: string;
    }
}

const SearchPage = async ({
    searchParams
}: SearchPageProps) => {
    let user = await currentUser()
    const userId = user?.id

    if (!userId) {
        return redirect('/')
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: 'asc'
        }
    })

    const courses = await getCourses({
        userId,
        ...searchParams,
    })

    return (
        <>
            <div className='px-6 pt-6 md:hidden md:mb-0 block'>
                <SearchInput />
            </div>
            <div className='p-6 space-y-4'>
                <Suspense fallback={<div>Loading filters...</div>}>
                    <Categories items={categories} />
                </Suspense>
                <CoursesList items={courses} />
            </div>
        </>
    )
}

export default SearchPage