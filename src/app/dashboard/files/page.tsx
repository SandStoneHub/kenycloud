import { Metadata } from "next";
import { FilesBrowser } from "../_components/file-browser";
import { SignedOut, SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Files",
    description: "Open Source file storage",
    icons: {
      icon: 'https://combative-moose-852.convex.site/getImage?storageId=kg20764hbyp6eaj2080rvawzpn72bb50',
    }
  };

export default function FilesPage(){
    return (
        <div>
            <FilesBrowser title="Файлы"/>
            <SignedOut>
              <SignIn />
            </SignedOut>
        </div>
    )
}