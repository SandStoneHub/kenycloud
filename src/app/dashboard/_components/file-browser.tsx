"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import EmptyImg from "../../../../public/image/empty.png"
import VentilEmptyImg from "../../../../public/image/emptyVentil.png"
import TrashImg from "../../../../public/image/Trash.png"
import { Loader2 } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useState } from "react";
import { DataTable } from "./file-table";
import { columns } from "./columns";
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Doc } from "../../../../convex/_generated/dataModel";
import { Label } from "@/components/ui/label";

function Placeholder(){
  const numbers: number = Math.floor(Math.random() * 36) + 1;
  return (
    <div className="flex flex-col gap-8 w-full items-center my-4">
      <Image
        alt=""
        width="400"
        height="400"
        src={numbers === 24 ? VentilEmptyImg : EmptyImg}
      />
      <div className="font-bold text-2xl text-center">
        Пока что тут нету файлов, но скоро они появятся (наверно)
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
        Пока что тут нету файлов, но скоро они появятся (наверно)
        <p className="text-base text-gray-500">
          *Все файлы из корзины удалятся спутся 7 дней после их перемещения
        </p>
      </div>
    </div>
  )
}

export function FilesBrowser({title, favoritesOnly, deletedOnly}: {title: string, favoritesOnly?: boolean, deletedOnly?: boolean}) {
  const organization = useOrganization()
  const user = useUser()
  const [query, setQuery] = useState("")
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all")
  const [sort, setSort] = useState<string>("default")

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded){
    orgId = organization.organization?.id ?? user.user?.id
  }

  const favorites = useQuery(api.files.getAllFavorites, 
    orgId ? {orgId} : "skip"
  )

  const files = useQuery(
    api.files.getFiles, 
    orgId ? {orgId, type: type === "all" ? undefined : type, query, favorites: favoritesOnly, deletedOnly} : "skip"
  )

  const isLoading = files === undefined

  const modifiedFiles = files?.map(file => ({
    ...file,
    isFavorited: (favorites ?? []).some(
      (favorite) => favorite.fileId === file._id
    )
  })) ?? []

  modifiedFiles.reverse()

  const modifiedFilesAlphabet = [...modifiedFiles].sort((a, b) => 
    a.name.localeCompare(b.name)
  ) ?? []

  type FileType = "image" | "imageother" | "table" | "zip" | "txt" | "presentation" | "pptx" | "video" | "audio" | "programming" | "exe" | "db"
  const sortOrder: FileType[] = [
    "image", "imageother", "table", "zip", "txt", "presentation", "pptx", 
    "video", "audio", "programming", "exe", "db"
  ];
  const modifiedFilesType = modifiedFiles.sort((a, b) => {
    return sortOrder.indexOf(a.type) - sortOrder.indexOf(b.type);
  });

  const getSortedFiles = () => {
    if (sort === "descending") {
      return [...modifiedFiles].reverse()
    } else if (sort === "alphabet") {
      return modifiedFilesAlphabet
    } else if (sort == "default"){
      return modifiedFiles
    } else if (sort == "alphabetreverse"){
      return modifiedFilesAlphabet.reverse()
    } else if (sort == "types"){
      return modifiedFilesType
    } else if (sort == "typesreverse"){
      return modifiedFilesType.reverse()
    }
  };
  
  const sortedFiles = getSortedFiles()

  return (
        <div>
              <div className="flex justify-between items-start sm:items-center mb-8 flex-col sm:flex-row">
                <h1 className="text-4xl font-bold mr-2">{title}</h1>
                <div className="py-4 sm:py-0"><SearchBar query={query} setQuery={setQuery}/></div>
                <UploadButton/>
              </div>

              <Tabs defaultValue="grid">
                <div className="flex justify-between flex-col">
                  {/* <TabsList className="mb-2">
                    <TabsTrigger value="grid" className="flex gap-2 items-center">Grid</TabsTrigger>
                    <TabsTrigger value="table" className="flex gap-2 items-center">Table</TabsTrigger>
                  </TabsList> */}

                  <div className="flex gap-0 md:gap-2 items-center">
                    <Label htmlFor="typeSelect"><p className="hidden sm:block">Показать:</p></Label>
                    <Select value={type} onValueChange={(newType) => {
                      setType(newType as any)
                    }}>
                      <SelectTrigger className="w-[180px]" id="type-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все</SelectItem>
                        <SelectItem value="image">Изображения</SelectItem>
                        <SelectItem value="audio">Аудио</SelectItem>
                        <SelectItem value="video">Видео</SelectItem>
                        <SelectItem value="table">Таблицы</SelectItem>
                        <SelectItem value="presentation">Презентации</SelectItem>
                        <SelectItem value="zip">Zip Архивы</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-0 md:gap-2 items-center mt-3">
                    <Label htmlFor="sortSelect"><p className="hidden sm:block">Сортировать:</p></Label>
                    <Select value={sort} onValueChange={(newSort) => {
                      setSort(newSort as string)
                    }}>
                      <SelectTrigger className="w-[180px]" id="sort-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">По новизне</SelectItem>
                        <SelectItem value="descending">По убыванию</SelectItem>
                        <SelectItem value="alphabet">По алфавиту (А-Я)</SelectItem>
                        <SelectItem value="alphabetreverse">По алфавиту (Я-А)</SelectItem>
                        <SelectItem value="types">По типу файла</SelectItem>
                        <SelectItem value="typesreverse">По типу файла (убывание)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {isLoading && 
                  <div className="flex flex-col gap-8 w-full items-center mt-12">
                    <Loader2 className="h-32 w-32 animate-spin text-white-grey"/>
                    <div className="text-2xl text-white-grey text-center">Загрузка...</div>
                  </div>
                }

                <TabsContent value="grid">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mr-2">
                      {sortedFiles?.map(file => (
                        <FileCard key={file._id} file={file} />
                      ))}
                    </div>
                </TabsContent>

                <TabsContent value="table">
                  <DataTable columns={columns} data={modifiedFiles} />
                </TabsContent>
              </Tabs>

              {files?.length === 0 && !deletedOnly &&(
                <Placeholder />
              )}

              {files?.length === 0 && deletedOnly &&(
                <PlaceholderTrash />
              )}
        </div>
  )
}
