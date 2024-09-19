"use client";

import {  useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import EmptyImg from "../app/empty.svg"
import { Loader2 } from "lucide-react";

export default function Home() {
  const organization = useOrganization()
  const user = useUser()

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded){
    orgId = organization.organization?.id ?? user.user?.id
  }

  const files = useQuery(
    api.files.getFiles, 
    orgId ? {orgId} : "skip"
  )
  const isLoading = files === undefined

  return (
    <main className="container mx-auto pt-12"> {/*flex min-h-screen flex-col items-center justify-between p-24*/}

      {isLoading && 
        <div className="flex flex-col gap-8 w-full items-center mt-12">
          <Loader2 className="h-32 w-32 animate-spin text-white-grey"/>
          <div className="text-2xl text-white-grey text-center">Loading...</div>
        </div>
      }

      {!isLoading && files.length === 0 &&(
        <div className="flex flex-col gap-8 w-full items-center mt-12">
          <Image
            alt=""
            width="400"
            height="400"
            src={EmptyImg}
          />
          <div className="font-bold text-2xl ">
            You have no files
          </div>
          <UploadButton/>
        </div>
      )}

      {!isLoading && files.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <UploadButton/>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {files?.map(file => {
              return <FileCard key={file._id} file={file}/>
            })}
          </div>
        </>
      )}

    </main>
  )
}
