'use client'

import { Button } from "@/components/ui/button"
import clsx from "clsx"
import { FileIcon, StarIcon, TrashIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function SideNav(){
  const pathname = usePathname()

    return (
        <div className="w-40 flex flex-col gap-4">
          <Link href="/dashboard/files">
            <Button variant={"link"} className={clsx("flex gap-2", {
              "text-blue-400": pathname.includes("/dashboard/files")
            })}>
              <FileIcon/><p className="hidden sm:block">Files</p>
            </Button>
          </Link>

          <Link href="/dashboard/favorite">
            <Button variant={"link"} className={clsx("flex gap-2", {
              "text-blue-400": pathname.includes("/dashboard/favorite")
            })}>
              <StarIcon/><p className="hidden sm:block">Favorite</p>
            </Button>
          </Link>

          <Link href="/dashboard/trash">
            <Button variant={"link"} className={clsx("flex gap-2", {
              "text-blue-400": pathname.includes("/dashboard/trash")
            })}>
              <TrashIcon/><p className="hidden sm:block">Trash</p>
            </Button>
          </Link>
        </div>
    )
}