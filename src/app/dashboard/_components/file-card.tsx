import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { FileIcon, ImageIcon, MoreVertical, StarHalf, StarIcon, TrashIcon, UndoIcon } from "lucide-react"
import { ReactNode, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Protect } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

function FileCardActions({ file, isFavorited }: { file: Doc<"files">, isFavorited:boolean }){
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

function getFileUrl(fileId: Id<"_storage">): string{
    return `${process.env.NEXT_PUBLIC_CONVEX_ACTION_URL}/getImage?storageId=${fileId}`
}

export function FileCard({file, favorites}: {file: Doc<"files">, favorites: Doc<"favorites">[]}){

    const userProfile = useQuery(api.users.getUserProfile, {
        userId: file.userId
    })

    const typeIcons = {
        image: <ImageIcon/>,
        pptx: <ImageIcon/>,
        pdf: <ImageIcon/>,
        zip: <ImageIcon/>,
        csv: <ImageIcon/>,
        txt: <ImageIcon/>,
        audio: <ImageIcon/>,
        video: <ImageIcon/>,
    } as Record<Doc<"files">["type"], ReactNode>

    const isFavorites = favorites.some((favorite) => favorite.fileId === file._id)

    return (
    <Card>
        <CardHeader className="relative">
            <CardTitle className="text-base font-normal">
                <div className="break-all flex gap-2">
                    <div>{typeIcons[file.type]}</div>{" "}
                    {file.name}
                </div>
            </CardTitle>
            <div className="absolute top-1 right-1 ">
                <FileCardActions isFavorited={isFavorites} file={file}/>
            </div>
            {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent className="break-words h-[200px] flex justify-center items-center">
            {
                file.type === "image" && <Image alt={file.name} width="200" height="100" src={getFileUrl(file.fileId)}/>
            }
            {
                file.type !== "image" && <ImageIcon className="w-20 h-20"/>
            }
        </CardContent>
        <CardFooter className="flex justify-between">
            <div className="flex gap-2 text-gray-500 items-center">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={userProfile?.image} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                {userProfile?.name}
            </div>

            <div className="text-xs text-gray-700">
                Uploaded on {formatRelative(new Date(file._creationTime), new Date())}
            </div>
        </CardFooter>
    </Card>
  )
  
}