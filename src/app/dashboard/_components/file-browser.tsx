"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import EmptyImg from "./empty.svg"
import { Loader2 } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useState } from "react";

function Placeholder(){
  return (
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
  )
}

export function FilesBrowser({title, favoritesOnly}: {title: string, favoritesOnly?: boolean}) {
  const organization = useOrganization()
  const user = useUser()
  const [query, setQuery] = useState("")

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded){
    orgId = organization.organization?.id ?? user.user?.id
  }

  const favorites = useQuery(api.files.getAllFavorites, 
    orgId ? {orgId} : "skip"
  )

  const files = useQuery(
    api.files.getFiles, 
    orgId ? {orgId, query, favorites: favoritesOnly} : "skip"
  )
  const isLoading = files === undefined

  return (
        <div>
          {isLoading && 
            <div className="flex flex-col gap-8 w-full items-center mt-12">
              <Loader2 className="h-32 w-32 animate-spin text-white-grey"/>
              <div className="text-2xl text-white-grey text-center">Loading...</div>
            </div>
          }

          {!isLoading && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">{title}</h1>
                <SearchBar query={query} setQuery={setQuery}/>
                <UploadButton/>
              </div>

              {files.length === 0 &&(
                <Placeholder />
              )}

              <div className="grid grid-cols-3 gap-4">
                {files?.map(file => {
                  return <FileCard favorites={favorites ?? []} key={file._id} file={file}/>
                })}
              </div>
            </>
          )}
        </div>
  )
}
