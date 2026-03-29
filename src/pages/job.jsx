import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplyJobDrawer } from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";

import useFetch from "@/hooks/use-fetch";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  console.log('Job data:', job);

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-8 mt-5">

      {/* ── Header: title + company logo ── */}
      <div className="flex flex-col-reverse gap-4 md:flex-row justify-between items-start md:items-center">
        <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl tracking-tight leading-tight">
          {job?.title}
        </h1>
        {job?.company?.logo_url && (
          <img
            src={job.company.logo_url}
            className="h-14 object-contain rounded-lg border border-border/30 p-1 bg-card"
            alt={job?.company?.name}
          />
        )}
      </div>

      {/* ── Meta info pills ── */}
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 bg-secondary/30">
          <MapPinIcon size={14} />
          {job?.location}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 bg-secondary/30">
          <Briefcase size={14} />
          {job?.applications?.length} Applicant{job?.applications?.length !== 1 ? "s" : ""}
        </span>
        {/* Open/Closed badge using global utility classes */}
        <span className={job?.isOpen ? "badge-open" : "badge-closed"}>
          {job?.isOpen ? <DoorOpen size={13} /> : <DoorClosed size={13} />}
          {job?.isOpen ? "Open" : "Closed"}
        </span>
      </div>

      {/* ── Recruiter hiring-status toggle ── */}
      {job?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full sm:w-64 font-medium ${
              job?.isOpen
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/40 bg-red-500/10 text-red-400"
            }`}
          >
            <SelectValue
              placeholder={"Hiring Status " + (job?.isOpen ? "(Open)" : "(Closed)")}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* ── About section ── */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">About the job</h2>
        <p className="text-muted-foreground sm:text-base leading-relaxed">{job?.description}</p>
      </div>

      <hr className="border-border/30" />

      {/* ── Requirements section ── */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">What we are looking for</h2>
        <MDEditor.Markdown
          source={job?.requirement}
          className="bg-transparent sm:text-base leading-relaxed"
        />
      </div>

      {/* ── Apply button (candidates only) ── */}
      {job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
        />
      )}

      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}

      {/* ── Applications list (recruiters only) ── */}
      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-xl border-b border-border/30 pb-3">
            Applications ({job.applications.length})
          </h2>
          {job.applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobPage;