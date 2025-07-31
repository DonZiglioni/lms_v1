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

        if (purchase) {
            return new NextResponse('Already Purchased', { status: 400 })
        }

        if (!course) {
            return new NextResponse('Not Found', { status: 404 })
        }

        let subscriber = false;

        if (courseId === '01c8bde5-2172-44d9-a85d-e58837f1d505') {
            subscriber = true;
        }


        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: 'USD',
                    product_data: {
                        name: course.title,
                        description: course.description!,
                    },
                    unit_amount: Math.round(course.price! * 100)
                },
            }
        ];
        const sub_line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: 'USD',
                    product_data: {
                        name: course.title,
                        description: course.description!,
                    },
                    unit_amount: Math.round(course.price! * 100),
                    recurring: {
                        interval: 'month'
                    }
                }
            }
        ];



        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: {
                userId: userId,
            },
            select: {
                stripeCustomerId: true,
            }
        })

        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress
            })

            stripeCustomer = await db.stripeCustomer.create({
                data: {
                    userId: userId,
                    stripeCustomerId: customer.id,
                }
            })
        }
        let session;

        if (subscriber) {
            session = await stripe.checkout.sessions.create({
                customer: stripeCustomer.stripeCustomerId,
                line_items: sub_line_items,
                mode: "subscription",
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?success=1`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?canceled=1`,
                metadata: {
                    courseId: courseId,
                    userId: userId
                }
            })

            const courses = await getCourses({ userId });

            courses.map(async (course, index) => {
                let purchace = await db.purchase.create({
                    data: {
                        courseId: course.id,
                        userId: userId
                    }
                })
                console.log("Purchaced: ", course.title, purchace);
            })

        } else {
            session = await stripe.checkout.sessions.create({
                customer: stripeCustomer.stripeCustomerId,
                line_items,
                mode: "payment",
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?success=1`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?canceled=1`,
                metadata: {
                    courseId: courseId,
                    userId: userId
                }
            })
            let purchace = await db.purchase.create({
                data: {
                    courseId: courseId,
                    userId: userId
                }
            })
            console.log(purchace);

        }

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.log("[COURSE_CHECKOUT]", error)
        return new NextResponse("Internal Error", { status: 500 })

    }
}