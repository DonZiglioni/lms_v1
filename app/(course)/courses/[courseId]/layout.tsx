import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import getProgress from "@/actions/getProgress"
import CourseSidebar from "./_components/CourseSidebar"
import CourseNavbar from "./_components/CourseNavbar"



const CourseLayout = async ({
    children,
    params
}: {
    children: React.ReactNode
    params: Promise<{ courseId: string }>
}) => {
    let user = await currentUser()
    const userId = user?.id
    const { courseId } = await params
    if (!userId) {
        return redirect('/')
    }

    const course = await db.course.findUnique({
        where: {
            id: courseId
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                include: {
                    userProgress: {
                        where: {
                            userId,
                        }
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            },
        },
    })

    if (!course) {
        return redirect('/')
    }

    const progressCount = await getProgress(userId, course.id)


    return (
        <div className="h-full">
            <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50 ">
                <CourseNavbar
                    course={course}
                    progressCount={progressCount}
                />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSidebar course={course} progressCount={progressCount} />
            </div>
            <main className="md:pl-80 h-full pt-[80px]">

                {children}
            </main>
        </div>
    )
}

export default CourseLayout