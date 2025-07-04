"use client"
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Loader2, Pencil, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Chapter, Course } from '@prisma/client'
import ChaptersList from './ChaptersList'
import { Checkbox } from '@/components/ui/checkbox'


interface ChaptersFormProps {
    initialData: Course & { chapters: Chapter[] };
    courseId: string;
}
const formSchema = z.object({
    title: z.string().min(1),
    isSection: z.boolean(),
})



const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
    const [isUpdating, setIsUpdating] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [isCreatingSection, setIsCreatingSection] = useState(false)
    const router = useRouter();

    const toggleCreating = () => {
        setIsCreating(!isCreating)
    }

    const toggleCreatingSection = () => {
        setIsCreatingSection(!isCreatingSection)
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: "", isSection: isCreatingSection },
    })


    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values)
            toast.success("Chapter Created")
            toggleCreating()
            toggleCreatingSection()
            router.refresh()
        } catch (error) {
            toast.error("Something Went Wrong");
        }
    }

    const onReorder = async (updateData: { id: string; position: number }[]) => {
        try {
            setIsUpdating(true)
            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData
            })
            toast.success("Chapters Reordered")
            router.refresh()
        } catch (error) {
            toast.error("Something Went Wrong");
        } finally {
            setIsUpdating(false)
        }
    }

    const onEdit = async (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`)
    }
    return (
        <div className='relative mt-6 border bg-slate-100 rounded-md p-4'>
            {isUpdating && (
                <div className='absolute h-full w-full top-0 right-0 bg-slate-500/20 rounded-md flex items-center justify-center'>
                    <Loader2 className='animate-spin h-6 w-6 text-sky-700' />
                </div>
            )}
            <div className='font-medium flex items-center justify-between'>
                Course Chapters
                <Button onClick={toggleCreating} variant={"ghost"}>
                    {isCreating && (
                        <>Cancel</>
                    )}
                    {!isCreating && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add a Chapter
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='e.g. "Introduction to course...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='flex items-center'>
                            <Button type='submit' disabled={!isValid || isSubmitting}>
                                Create
                            </Button>

                            <FormField
                                control={form.control}
                                name='isSection'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} className=' border-slate-400 ml-4' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <span className='ml-2 text-muted-foreground italic text-sm'>
                                Make this a section
                            </span>
                        </div>
                    </form>
                </Form>
            )}

            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.chapters.length && "text-slate-500 italic"
                )}>
                    {!initialData.chapters.length && "No Chapters"}
                    <ChaptersList onEdit={onEdit}
                        onReorder={onReorder}
                        items={initialData.chapters || []}
                    />
                </div>
            )}
            {!isCreating && (
                <p className='text-xs text-muted-foreground mt-4'>
                    Drag and drop to reorder the chapters
                </p>
            )}
        </div>
    )
}

export default ChaptersForm