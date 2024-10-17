"use client"

import { useUser } from '@clerk/clerk-react'
import Page403 from "../errors/403";
import { SideNav } from "./side-nav"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { isSignedIn } = useUser()

  return (
      <>
        {(process.env.SERVER_STATE === "True" || !isSignedIn) ? (
          <Page403/>
        ) : (
          <main className="container mx-auto pt-12">
            <div className="flex gap-8">
              <SideNav />
              <div className="w-full">
                {children}
              </div>
            </div>
          </main>
        )}
      </>
  );
}