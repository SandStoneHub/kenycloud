"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { formatRelative } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileCardActions } from "./file-actions"

function UserCell({userId}: {userId: Id<"users">}){
    const userProfile = useQuery(api.users.getUserProfile, {
        userId: userId
    })
    return (
        <div className="flex gap-2 text-gray-500 items-center">
            <Avatar className="w-8 h-8">
                <AvatarImage src={userProfile?.image} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {userProfile?.name}
        </div>
    )
}

export const columns: ColumnDef<Doc<"files"> & {isFavorited: boolean}>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "User",
    cell: ({ row }) => {
        return <UserCell userId={row.original.userId}/>
      },
  },
  {
    accessorKey: "Uploaded On",
    cell: ({ row }) => {
        return <div>{formatRelative(new Date(row.original._creationTime), new Date())}</div>
      },
  },
  {
    accessorKey: "Actions",
    cell: ({ row }) => {
        return <div><FileCardActions file={row.original} isFavorited={row.original.isFavorited}/></div>
      },
  }
]
