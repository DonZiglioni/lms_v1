"use client"

import { cn } from "@/lib/utils"
import { CheckCircle, Lock, PlayCircle, Layers2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

interface CourseSidebarItemProps {
    id: string
    label: string
    isCompleted: boolean
    courseId: string
    isLocked: boolean
    isSection: boolean
}

const CourseSidebarItem = ({
    id,
    label,
    isCompleted,
    courseId,
    isLocked,
    isSection
}: CourseSidebarItemProps) => {

    const pathname = usePathname()
    const router = useRouter()

    let Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle)
    if (isSection) {
        Icon = Layers2
    }

    const isActive = pathname?.includes(id)

    const onClick = () => {
        if (isSection) {
            return null
        } else {
            router.push(`/courses/${courseId}/chapters/${id}`)
        }
    }
    return (
        <>
            <button
                onClick={onClick}
                type="button"
                className={cn(
                    "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 ml-4",
                    isActive && "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
                    isCompleted && "text-emerald-700 hover:text-emerald-700 ",
                    isCompleted && isActive && "bg-emerald-200/20 ",
                    isSection && "hover:bg-white ml-0"
                )}>
                <div className="flex items-center gap-x-2 py-4">
                    <Icon
                        size={22}
                        className={cn(
                            "text-slate-500",
                            isActive && " text-slate-700",
                            isCompleted && " text-emerald-700"
                        )}
                    />
                    {label}
                </div>
                <div className={cn(
                    "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
                    isActive && "opacity-100",
                    isCompleted && "border-emerald-700"
                )}>

                </div>
            </button>
        </>
    )
}

export default CourseSidebarItem