
import { isTeacher } from "@/lib/teacher";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


const TeacherLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    let user = await currentUser()
    const userId = user?.id
    if (!isTeacher(userId)) {
        return redirect('/')
    }

    return (
        <>
            {children}
        </>
    )
}

export default TeacherLayout