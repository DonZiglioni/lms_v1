"use client"

import ConfirmModel from "@/components/models/ConfirmModel";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";


interface ChapterActionsProps {
    disabled: boolean;
    courseId: string
    chapterId: string
    isPublished: boolean
}
const ChapterActions = ({
    disabled,
    courseId,
    chapterId,
    isPublished,
}: ChapterActionsProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const onClick = async () => {
        try {
            setIsLoading(true)
            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
                toast.success("Chapter Unpublished")
            } else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
                toast.success("Chapter Published")
            }
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }



    const onDelete = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
            toast.success("Chapter Deleted")
            router.refresh()
            router.push(`/teacher/courses/${courseId}`)
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant={"outline"}
                size={"sm"}
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModel onConfirm={onDelete}>
                <Button size={"sm"}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModel>
        </div>
    )
}

export default ChapterActions