import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const navigateUser = (currRole) => {
    navigate(currRole === "recruiter" ? "/post-job" : "/jobs");
  };

  const handleRoleSelection = async (role) => {
    await user
      .update({ unsafeMetadata: { role } })
      .then(() => {
        console.log(`Role updated to: ${role}`);
        navigateUser(role);
      })
      .catch((err) => {
        console.error("Error updating role:", err);
      });
  };

  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigateUser(user.unsafeMetadata.role);
    }
  }, [user]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-10 px-4">
      <div className="text-center">
        <h2 className="gradient-title font-extrabold text-6xl sm:text-8xl tracking-tighter">
          I am a...
        </h2>
        <p className="text-muted-foreground mt-3 text-sm sm:text-base">
          Select your role to get started
        </p>
      </div>

      {/* Role selection — large tap targets with descriptions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
        <button
          onClick={() => handleRoleSelection("candidate")}
          className="group flex flex-col items-center justify-center gap-3 h-44 rounded-2xl border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/15 hover:border-blue-500/60 hover:-translate-y-1 transition-all duration-200 cursor-pointer p-6"
        >
          <span className="text-4xl">🎯</span>
          <span className="text-xl font-bold text-blue-400">Candidate</span>
          <span className="text-xs text-muted-foreground text-center">Find and apply for jobs</span>
        </button>

        <button
          onClick={() => handleRoleSelection("recruiter")}
          className="group flex flex-col items-center justify-center gap-3 h-44 rounded-2xl border border-destructive/30 bg-destructive/5 hover:bg-destructive/15 hover:border-destructive/60 hover:-translate-y-1 transition-all duration-200 cursor-pointer p-6"
        >
          <span className="text-4xl">🏢</span>
          <span className="text-xl font-bold text-destructive">Recruiter</span>
          <span className="text-xs text-muted-foreground text-center">Post jobs and hire talent</span>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;