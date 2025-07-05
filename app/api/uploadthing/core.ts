import { isTeacher } from "@/lib/teacher";
import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing } from "uploadthing/next";
import type { FileRouter } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
    const user = await currentUser()
    const userId = user?.id

    const isAuthorized = isTeacher(userId)

    if (!userId || !isAuthorized) {
        throw new Error("Unauthorized")
    }
    return { userId }
}

export const ourFileRouter = {
    courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
    courseAttachment: f(['text', 'image', 'video', 'audio', 'pdf'])
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
    chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: '1024MB' } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
