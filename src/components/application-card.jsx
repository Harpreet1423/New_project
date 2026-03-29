/* eslint-disable react/prop-types */
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { updateApplicationStatus } from "@/api/apiApplications.js";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id,
    }
  );

  const handleStatusChange = (status) => {
    fnHiringStatus(status).then(() => fnHiringStatus());
  };

  return (
    <Card>
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}

      <CardHeader>
        <CardTitle className="flex justify-between items-start gap-3 font-bold text-base leading-snug">
          <span className="flex-1">
            {isCandidate
              ? `${application?.job?.title} at ${application?.job?.company?.name}`
              : application?.name}
          </span>
          {/* Download resume — subtle circular button */}
          <Download
            size={16}
            className="shrink-0 bg-foreground/10 text-foreground rounded-full h-8 w-8 p-2 cursor-pointer hover:bg-foreground/20 transition-colors"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        {/* Applicant details row */}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex gap-1.5 items-center">
            <BriefcaseBusiness size={13} />
            {application?.experience} yr{application?.experience !== 1 ? "s" : ""} experience
          </span>
          <span className="flex gap-1.5 items-center">
            <School size={13} />
            {application?.education}
          </span>
          <span className="flex gap-1.5 items-center">
            <Boxes size={13} />
            {application?.skills}
          </span>
        </div>
        <hr className="border-border/40" />
      </CardContent>

      <CardFooter className="flex flex-wrap justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          {new Date(application?.created_at).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
          })}
        </span>

        {isCandidate ? (
          /* Color-coded status pill based on status value */
          <span className={`capitalize text-xs font-medium px-3 py-1 rounded-full border inline-flex items-center gap-1
            status-${application.status}`}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
            {application.status}
          </span>
        ) : (
          <Select onValueChange={handleStatusChange} defaultValue={application.status}>
            <SelectTrigger className="w-44 h-8 text-xs">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;