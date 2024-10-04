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
import { Button } from "@/components/ui/button"
import { ImageIcon, MoreVertical, StarHalf, StarIcon, TrashIcon } from "lucide-react"
import { ReactNode, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Protect } from "@clerk/nextjs"

function FileCardActions({ file, isFavorited }: { file: Doc<"files">, isFavorited:boolean }){
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const deleteFile = useMutation(api.files.deleteFile)
    const toggleFavorite = useMutation(api.files.toggleFavorite)
    const { toast } = useToast()
    
    return (
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => {
                            await deleteFile({fileId: file._id})
                            toast({
                                variant: "default",
                                title: "File deleted",
                                description: "Success delete"
                            })
                        }}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
                <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
                <DropdownMenuContent>

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
                        <DropdownMenuItem className="flex gap-1 text-red-500 items-center cursor-pointer" onClick={() => setIsConfirmOpen(true)}>
                            <TrashIcon className="w-4 h-4"/> Delete
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
            <CardTitle>
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
        <CardFooter>
            <Button onClick={() => {
                window.open(getFileUrl(file.fileId), "_blank")
            }}>Download</Button>
        </CardFooter>
    </Card>
  )
  
}