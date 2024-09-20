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
import { ImageIcon, MoreVertical, TrashIcon } from "lucide-react"
import { ReactNode, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

function FileCardActions({ file }: { file: Doc<"files"> }){
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const deleteFile = useMutation(api.files.deleteFile)
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
                    <DropdownMenuItem className="flex gap-1 text-red-500 items-center cursor-pointer" onClick={() => setIsConfirmOpen(true)}>
                        <TrashIcon className="w-4 h-4"/> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

function getFileUrl(fileId: Id<"_storage">): string{
    return "https://combative-moose-852.convex.cloud/api/storage/63916f0c-65ff-4487-b3d2-b0ab70848f35"//`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`
}

export function FileCard({file}: {file: Doc<"files">}){

    const typeIcons = {
        image: <ImageIcon/>,
        pptx: <ImageIcon/>,
        pdf: <ImageIcon/>,
        zip: <ImageIcon/>,
        csv: <ImageIcon/>,
        txt: <ImageIcon/>,
        audio: <ImageIcon/>,
        video: <ImageIcon/>
      } as Record<Doc<"files">["type"], ReactNode>

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
                <FileCardActions file={file}/>
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