import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { FileIcon, MoreVertical, StarHalf, StarIcon, TrashIcon, UndoIcon } from "lucide-react"
import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useToast } from "@/hooks/use-toast"
import { Protect } from "@clerk/nextjs"

export function FileCardActions({ file, isFavorited }: { file: Doc<"files">, isFavorited:boolean }){
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const deleteFile = useMutation(api.files.deleteFile)
    const restoreFile = useMutation(api.files.restoreFile)
    const toggleFavorite = useMutation(api.files.toggleFavorite)
    const { toast } = useToast()
    
    return (
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will move your file to the trash, from where you can restore it
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => {
                            await deleteFile({fileId: file._id})
                            toast({
                                variant: "default",
                                title: "File move to trash",
                                description: "Your file has been moved to the trash"
                            })
                        }}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
                <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
                <DropdownMenuContent>
                    
                    <DropdownMenuItem className="flex gap-1 items-center cursor-pointer" onClick={() => {
                        window.open(getFileUrl(file.fileId), "_blank")
                    }}>
                        <FileIcon className="w-4 h-4"/> Download
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex gap-1 items-center cursor-pointer" onClick={() => {
                        toggleFavorite({fileId: file._id})
                    }}>
                        {isFavorited ? (
                            <div className="flex gap-1 items-center">
                                <StarHalf className="w-4 h-4"/> Unfavorite
                            </div>
                        ):(
                            <div className="flex gap-1 items-center">
                                <StarIcon className="w-4 h-4"/> Favorite
                            </div>
                        )}
                    </DropdownMenuItem>
                    
                    <Protect
                        role="org:admin"
                        fallback={<></>}
                    >
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex gap-1 items-center cursor-pointer" onClick={() => {
                            if (file.shouldDelete){
                                restoreFile({
                                    fileId: file._id
                                })
                            } else {
                                setIsConfirmOpen(true)
                            }
                            
                        }}>
                            {file.shouldDelete ? <div className="flex gap-1 text-green-500 items-center cursor-pointer">
                                <UndoIcon className="w-4 h-4"/> Restore
                            </div> :
                            <div className="flex gap-1 text-red-500 items-center cursor-pointer">
                                <TrashIcon className="w-4 h-4"/> Delete
                            </div>
                            }
                        </DropdownMenuItem>
                    </Protect>
                </DropdownMenuContent>

            </DropdownMenu>
        </>
    )
}

export function getFileUrl(fileId: Id<"_storage">): string{
    return `${process.env.NEXT_PUBLIC_CONVEX_ACTION_URL}/getImage?storageId=${fileId}`
}