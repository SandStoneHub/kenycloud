"use client"

import { useUser } from '@clerk/clerk-react'
import Page403 from "../errors/403";
import { SideNav } from "./side-nav"
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { isSignedIn } = useUser()
  const [showPage403, setShowPage403] = useState(false)

  useEffect(() => {
    if (process.env.SERVER_STATE === "True" || !isSignedIn) {
      const timer = setTimeout(() => {
        setShowPage403(true)
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      setShowPage403(false)
    }
  }, [isSignedIn])

  return (
      <>
        {showPage403 ? (
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