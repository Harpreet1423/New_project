import { useUser } from "@clerk/clerk-react";
import ApplicationCard from "./application-card";
import { useEffect } from "react";
import { getApplications } from "@/api/apiApplications.js";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

const CreatedApplications = () => {
  const { user } = useUser();

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    fnApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {applications?.length ? (
        applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate={true}
          />
        ))
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3 text-muted-foreground">
          <span className="text-5xl">📋</span>
          <p className="text-lg font-semibold text-foreground">No applications yet</p>
          <p className="text-sm max-w-xs">Start browsing jobs and submit your first application.</p>
        </div>
      )}
    </div>
  );
};

export default CreatedApplications;