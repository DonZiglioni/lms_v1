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
import { Pencil } from 'lucide-react'
import { useState } from 'react'


interface TitleFormProps {
    initialData: {
        title: string
    },
    courseId: string
}
const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required"
    })
})



const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter();

    const toggleEdit = () => {
        setIsEditing(!isEditing)
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    })


    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course updated")
            toggleEdit()
            router.refresh()
        } catch (error) {
            toast.error("Something Went Wrong");
        }
    }


    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course Title
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit Title
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className='text-sm mt-2'>
                    {initialData.title}
                </p>
            )}
            {isEditing && (
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
                                            placeholder='e.g. "Advanced New Course...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex items-center gap-x-2'>
                            <Button type='submit' disabled={!isValid || isSubmitting}>
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}

export default TitleForm