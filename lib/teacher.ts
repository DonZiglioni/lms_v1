export const isTeacher = (userId?: string | null) => {
    if (userId === process.env.NEXT_PUBLIC_TEACHER_ID_X ||
        // userId === process.env.NEXT_PUBLIC_TEACHER_ID_Z ||
        userId === process.env.NEXT_PUBLIC_TEACHER_ID
    ) {
        return true
    }


    return false
}