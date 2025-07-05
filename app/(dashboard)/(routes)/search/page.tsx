import { db } from '@/lib/db'
import Categories from './_components/Categories'
import SearchInput from '@/components/SearchInput'
import getCourses from '@/actions/getCourses'
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from 'next/navigation'
import CoursesList from '@/components/CoursesList'
import { Suspense } from 'react'
import SearchClientWrapper from './_components/SearchClientWrapper'

interface SearchPageProps {
    searchParams: {
        title: string;
        categoryId: string;
    };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
    let user = await currentUser()
    const userId = user?.id

    const title = searchParams.title
    const categoryId = searchParams.categoryId

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
        title,
        categoryId,
    })

    return (
        <>
            <div className='px-6 pt-6 md:hidden md:mb-0 block'>
                <SearchInput />
            </div>
            <SearchClientWrapper
                userId={userId}
                categories={categories}
                searchParams={searchParams}

            />
        </>
    )
}

export default SearchPage