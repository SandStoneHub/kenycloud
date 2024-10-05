"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import EmptyImg from "./empty.svg"
import TrashImg from "./trash.webp"
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

function PlaceholderTrash(){
  return (
    <div className="flex flex-col gap-3 w-full items-center mt-16 mb-5">
      <Image
        alt=""
        width="400"
        height="400"
        src={TrashImg}
      />
      <div className="font-bold text-2xl text-center">
        You have no files
        <p className="text-base text-gray-500">*all files will be deleted after 7 days</p>
      </div>
    </div>
  )
}

export function FilesBrowser({title, favoritesOnly, deletedOnly}: {title: string, favoritesOnly?: boolean, deletedOnly?: boolean}) {
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
    orgId ? {orgId, query, favorites: favoritesOnly, deletedOnly} : "skip"
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

              {files.length === 0 && !deletedOnly &&(
                <Placeholder />
              )}

              {files.length === 0 && deletedOnly &&(
                <PlaceholderTrash />
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
