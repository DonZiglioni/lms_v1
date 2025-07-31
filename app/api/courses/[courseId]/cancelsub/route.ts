import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from '@/lib/stripe'
import getCourses from "@/actions/getCourses"

export const POST = async (
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) => {
    try {
        let user = await currentUser()
        const userId = user?.id

        const { courseId } = await params

        if (!userId || !user || !user.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true,
            }
        })

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: userId,
                    courseId: courseId,
                }
            }
        })

        if (!course) {
            return new NextResponse('Not Found', { status: 404 })
        }

        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: {
                userId: userId,
            },
            select: {
                stripeCustomerId: true,
            }
        })

        let subscriptionId = await stripe.subscriptions.list({
            customer: stripeCustomer?.stripeCustomerId
        })

        console.log(subscriptionId.data[0].id);

        const subscription = await stripe.subscriptions.cancel(subscriptionId.data[0].id)
        console.log("Canceled SUB");

        if (subscription) {
            const purchasedCourses = await db.purchase.findMany({
                where: {
                    userId: userId
                },
            })
            console.log("COURSES ENROLLED:", purchasedCourses);

            purchasedCourses.map(async (purchase) => {
                let removed = await db.purchase.delete({
                    where: {
                        id: purchase.id,
                        userId: userId,
                    }
                })
                console.log("REMOVED: ", purchase.id, removed);

            })

        }



        return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?success=1` })
    } catch (error) {
        console.log("[COURSE_CHECKOUT]", error)
        return new NextResponse("Internal Error", { status: 500 })

    }
}