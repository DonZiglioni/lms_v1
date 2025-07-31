"use client"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface CancelSubButtonProps {
    courseId: string;
}

const CancelSubButton = ({
    courseId,
}: CancelSubButtonProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [confirmBox, setConfirmBox] = useState(false)

    const onClick = async () => {
        try {
            setIsLoading(true)
            const response = await axios.post(`/api/courses/${courseId}/cancelsub`)
            window.location.assign(response.data.url)
        } catch (error) {
            toast.error('Something went wrong.')
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <>
            {confirmBox && (
                <div className="absolute top-0 left-0 h-screen w-full bg-black/90 z-50 flex items-center justify-center ">
                    <div className="h-120 w-100 p-6 border-red-600 border-2 flex flex-col justify-evenly items-center text-slate-200 rounded-lg">
                        <h1 className="font-extrabold text-2xl" >
                            Are you sure??
                        </h1>
                        <p className="text-center">
                            Currently, when you cancel your subscription access to the courses is removed immediatly upon cancellation.
                            We are working to correct this issue.  Please be sure that you no longer need access to all the courses.
                            Courses purchaced prior to subscription will still be active for you.
                        </p>
                        <p className="text-center">
                            If you have any questions or encounter any issues, please email us at:
                        </p>
                        <h2>support@mixtechniques.com</h2>
                        <Button
                            disabled={isLoading}
                            onClick={onClick}
                            className="w-full md:w-auto"
                            variant={"destructive"}
                            size={'sm'}>
                            Cancel Subscription
                        </Button>
                        <Button
                            disabled={isLoading}
                            onClick={() => setConfirmBox(!confirmBox)}
                            className="w-full md:w-auto"
                            variant={"success"}
                            size={'sm'}>
                            GO BACK
                        </Button>
                    </div>
                </div>
            )}
            <Button
                disabled={isLoading}
                onClick={() => setConfirmBox(!confirmBox)}
                className="w-full md:w-auto"
                variant={"destructive"}
                size={'sm'}>
                Cancel Subscription
            </Button>
        </>
    )
}

export default CancelSubButton