"use client"

import { FilesBrowser } from "../_components/file-browser";

export default function FavoritePage(){
    return (
        <div>
            <FilesBrowser title="Trash" deletedOnly={true}/>
        </div>
    )
}