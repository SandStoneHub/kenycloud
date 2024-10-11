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
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useToast } from "@/hooks/use-toast"
import { Protect } from "@clerk/nextjs"
import Image from "next/image"
import starImg from "../../../../public/icon/Star.svg"
import unstarImg from "../../../../public/icon/UnStar.svg"

export function FileCardActions({ file, isFavorited }: { file: Doc<"files">, isFavorited:boolean }){
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const deleteFile = useMutation(api.files.deleteFile)
    const restoreFile = useMutation(api.files.restoreFile)
    const toggleFavorite = useMutation(api.files.toggleFavorite)
    const me = useQuery(api.users.getMe)
    const { toast } = useToast()
    
    return (
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Вы абсолютно уверены?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Это действие переместит ваш файл в корзину, а при повторном действии, удалит его навсегда без возможности восстановления
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => {
                            await deleteFile({fileId: file._id})
                            toast({
                                variant: "default",
                                title: "Файл удален",
                                description: "Ваш файл был перемещен в корзину, перейдите чтобы его восстановить"
                            })
                        }}>Удалить</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
                <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
                <DropdownMenuContent>
                    
                    <DropdownMenuItem className="flex gap-1 items-center cursor-pointer" onClick={() => {
                        window.open(getFileUrl(file.fileId), "_blank")
                    }}>
                        <FileIcon className="w-4 h-4"/> Скачать
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex gap-1 items-center cursor-pointer" onClick={() => {
                        toggleFavorite({fileId: file._id})
                    }}>
                        {isFavorited ? (
                            <div className="flex gap-1 items-center">
                                <Image src={starImg} className="w-4 h-4" alt="избранные"/> Удалить из Избранных
                            </div>
                        ):(
                            <div className="flex gap-1 items-center">
                                <Image src={unstarImg} className="w-4 h-4" alt="избранные"/> Добавить в Избранные
                            </div>
                        )}
                    </DropdownMenuItem>
                    
                    <Protect
                        condition={(check) => {
                            return check({
                                role: "org:admin"
                            }) || file.userId === me?._id
                        }}
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
                                <UndoIcon className="w-4 h-4"/> Восстановить
                            </div> :
                            <div className="flex gap-1 text-red-500 items-center cursor-pointer">
                                <TrashIcon className="w-4 h-4"/> Удалить
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