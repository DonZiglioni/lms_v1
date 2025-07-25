"use client"

import { Button } from "@/components/ui/button"
import { useConfettiStore } from "@/hooks/useConfettiStore"
import axios from "axios"
import { CheckCircle, XCircle } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

interface CourseProgressButtonProps {
    courseId: string
    chapterId: string
    isCompleted?: boolean
    nextChapterId?: string
}


const CourseProgressButton = ({
    courseId,
    chapterId,
    isCompleted,
    nextChapterId,

}: CourseProgressButtonProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const confetti = useConfettiStore()
    const [isLoading, setIsLoading] = useState(false)
    const onClick = async () => {
        try {
            setIsLoading(true)
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted
            })

            if (!isCompleted && !nextChapterId) {
                confetti.onOpen()
            }

            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
            }

            toast.success('Progress Updated')
            router.refresh()

        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }
    const Icon = isCompleted ? XCircle : CheckCircle


    return (
        <Button
            type="button"
            variant={isCompleted ? "outline" : "success"}
            className="w-full md:w-auto"
            onClick={onClick}
        >
            {isCompleted ? "Not Completed" : "Mark as complete"}
            <Icon className="h-4 w-4 ml-2" />
        </Button>

    )
}

export default CourseProgressButton