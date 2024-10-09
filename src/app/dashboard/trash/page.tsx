import { Metadata } from "next";
import { FilesBrowser } from "../_components/file-browser";

export const metadata: Metadata = {
    title: "Trash",
    description: "Open Source file storage",
    icons: {
      icon: 'https://combative-moose-852.convex.site/getImage?storageId=kg20764hbyp6eaj2080rvawzpn72bb50',
    }
  };

export default function FavoritePage(){
    return (
        <div>
            <FilesBrowser title="Trash" deletedOnly={true}/>
        </div>
    )
}