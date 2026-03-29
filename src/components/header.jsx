import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { BriefcaseBusiness, Heart, PenBox, Sparkles } from "lucide-react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);

  const [search, setSearch] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <>
      {/* Nav: logo left, actions right — compact vertical padding so sticky header stays slim */}
      <nav className="py-3 flex justify-between items-center">
        <Link to="/" className="flex-shrink-0">
          <img src="/logoo.png" className="h-9 sm:h-10 object-contain" alt="nextHire Logo" />
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <SignedOut>
            {/* Outlined login button — subtle in dark mode */}
            <Button
              variant="outline"
              className="rounded-full px-5 text-sm font-medium hover:bg-primary/10 transition-colors"
              onClick={() => setShowSignIn(true)}
            >
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            <Link to="/resume-refine">
              <Button variant="outline" className="rounded-full">
                <Sparkles size={16} className="mr-2" />
                Refine Resume
              </Button>
            </Link>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                {/* Rounded pill CTA visible at all sizes */}
                <Button variant="destructive" className="rounded-full text-sm gap-1.5 px-4">
                  <PenBox size={16} />
                  <span className="hidden sm:inline">Post a Job</span>
                </Button>
              </Link>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                />
                <UserButton.Link
                  label="Refine Resume"
                  labelIcon={<Sparkles size={15} />}
                  href="/resume-refine"
                />
                <UserButton.Action label="manageAccount" />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default Header;


