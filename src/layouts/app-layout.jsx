// import React from 'react'
// import { Outlet } from 'react-router-dom';
// import Header from "@/components/header";

// const AppLayout = () => {
//   return (
//       <div>
//       <div className="grid-background"></div>
//       <main className="container mx-auto">
//         <Header />
//         <Outlet />
//       </main>
//       <div className="p-10 text-center bg-gray-800 mt-10">Made by Harpreet</div>
//      </div>
//   )
// }

// export default AppLayout;

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from "@/components/header.jsx";

const AppLayout = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      
      {/* Background Grid */}
      <div className="grid-background fixed inset-0 -z-10"></div>

      {/* Sticky header with blur backdrop — stays above content on scroll */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/75 border-b border-border/40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <Header />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer — minimal, matches dark theme */}
      <footer className="border-t border-border/30 py-5 text-center text-sm text-muted-foreground bg-background/60 backdrop-blur-sm">
        Made with <span className="text-red-400 text-base">♥</span> by Harpreet
      </footer>
    </div>
  );
};

export default AppLayout;
