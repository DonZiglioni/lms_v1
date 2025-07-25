import getDashboardCourses from "@/actions/getDashboardCourses";
import CoursesList from "@/components/CoursesList";
import { currentUser } from "@clerk/nextjs/server";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import InfoCard from "./_components/InfoCard";

export default async function Dashboard() {
  let user = await currentUser()
  const userId = user?.id

  if (!userId) {
    return redirect('/')
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId)


  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList
        items={[...coursesInProgress, ...completedCourses]}
      />
    </div>
  );
}
