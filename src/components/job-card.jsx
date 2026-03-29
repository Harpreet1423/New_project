
// /* eslint-disable react/prop-types */
// import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
// import { Button } from "./ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "./ui/card";
// import { Link } from "react-router-dom";
// import useFetch from "@/hooks/use-fetch";
// import { deleteJob, saveJob } from "@/api/apiJobs";
// import { useUser } from "@clerk/clerk-react";
// import { useEffect, useState } from "react";
// import { BarLoader } from "react-spinners";

// const JobCard = ({
//   job,
//   savedInit = false,
//   onJobAction = () => {},
//   isMyJob = false,
// }) => {
//   const [saved, setSaved] = useState(savedInit);

//   const { user } = useUser();

//   const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
//     job_id: job.id,
//   });

//   const {
//     loading: loadingSavedJob,
//     data: savedJob,
//     fn: fnSavedJob,
//   } = useFetch(saveJob);

//   const handleSaveJob = async () => {
//     await fnSavedJob({
//       alreadySaved: saved,
//       user_id: user.id,
//       job_id: job.id,
//     });
//     onJobAction();
//   };

//   const handleDeleteJob = async () => {
//     await fnDeleteJob();
//     onJobAction();
//   };

//   useEffect(() => {
//     if (savedJob !== undefined) {
//       if (Array.isArray(savedJob)) {
//         setSaved(savedJob.length > 0);
//       } else {
//         setSaved(!!savedJob);
//       }
//     }
//   }, [savedJob]);

//   return (
//     <Card className="flex flex-col">
//       {loadingDeleteJob && (
//         <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
//       )}

//       <CardHeader className="flex flex-row justify-between items-start">
//         <CardTitle className="font-bold">{job?.title || "Untitled Job"}</CardTitle>

//         {isMyJob && (
//           <Trash2Icon
//             fill="red"
//             size={18}
//             className="text-red-300 cursor-pointer"
//             onClick={handleDeleteJob}
//           />
//         )}
//       </CardHeader>
      
//       <CardContent className="flex flex-col gap-4 flex-1">
//         <div className="flex justify-between">
//           {job?.company?.logo_url && (
//             <img src={job.company.logo_url} className="h-6" alt="Company logo" />
//           )}
//           <div className="flex gap-2 items-center">
//             <MapPinIcon size={15} /> {job?.location || "Location not specified"}
//           </div>
//         </div>
//         <hr />
//         {job?.description && job.description.length > 150
//           ? job.description.slice(0, 150) + "..."
//           : job?.description || "No description available"}
//       </CardContent>
      
//       <CardFooter className="flex gap-2">
//         <Link to={`/job/${job.id}`} className="flex-1">
//           <Button variant="secondary" className="w-full">
//             More Details
//           </Button>
//         </Link>
//         {!isMyJob && (
//           <Button
//             variant="outline"
//             className="w-15"
//             onClick={handleSaveJob}
//             disabled={loadingSavedJob}
//           >
//             {saved ? (
//               <Heart size={20} fill="red" stroke="red" />
//             ) : (
//               <Heart size={20} />
//             )}
//           </Button>
//         )}
//       </CardFooter>
//     </Card>
//   );
// };

// export default JobCard;

/* eslint-disable react/prop-types */
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteJob, saveJob } from "@/api/apiJobs";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);

  const { user } = useUser();

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const {
    loading: loadingSavedJob,
    data: savedJob,
    fn: fnSavedJob,
  } = useFetch(saveJob);

  const handleSaveJob = async () => {
    // useFetch passes options as second param, so we need to pass saveData there
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    onJobAction();
  };

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
  };

  useEffect(() => {
    if (savedJob !== undefined) {
      if (Array.isArray(savedJob)) {
        setSaved(savedJob.length > 0);
      } else {
        // Check if it's the "unsaved" message or actual data
        setSaved(savedJob && !savedJob.message);
      }
    }
  }, [savedJob]);

  return (
    /* Hover: lift + stronger shadow via the card's transition-all */
    <Card className="flex flex-col hover:-translate-y-1 hover:shadow-xl hover:border-border/80">
      {loadingDeleteJob && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      <CardHeader className="flex flex-row justify-between items-start gap-2">
        <div className="flex flex-col gap-2 min-w-0">
          <CardTitle className="font-bold text-base leading-snug line-clamp-2">
            {job?.title || "Untitled Job"}
          </CardTitle>
          {/* Open/Closed badge using global utility classes from index.css */}
          {job?.isOpen !== undefined && (
            <span className={job.isOpen ? "badge-open w-fit" : "badge-closed w-fit"}>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
              {job.isOpen ? "Open" : "Closed"}
            </span>
          )}
        </div>

        {isMyJob && (
          <Trash2Icon
            fill="red"
            size={18}
            className="text-red-400 cursor-pointer shrink-0 hover:text-red-300 transition-colors mt-0.5"
            onClick={handleDeleteJob}
          />
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        {/* Company logo + location row */}
        <div className="flex items-center justify-between gap-2">
          {job?.company?.logo_url && (
            <img
              src={job.company.logo_url}
              className="h-6 object-contain"
              alt={job?.company?.name || "Company logo"}
            />
          )}
          <div className="flex gap-1.5 items-center text-sm text-muted-foreground ml-auto">
            <MapPinIcon size={13} />
            <span className="truncate max-w-32">{job?.location || "Unspecified"}</span>
          </div>
        </div>

        <hr className="border-border/40" />

        {/* Description preview */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {job?.description
            ? job.description.length > 150
              ? job.description.slice(0, 150) + "..."
              : job.description
            : "No description available"}
        </p>
      </CardContent>

      <CardFooter className="flex gap-2 pt-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full text-sm hover:bg-secondary/80 transition-colors">
            More Details
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            variant="outline"
            className="px-3 shrink-0 hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
          >
            {saved ? (
              <Heart size={18} fill="rgb(239 68 68)" stroke="rgb(239 68 68)" />
            ) : (
              <Heart size={18} className="text-muted-foreground" />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;