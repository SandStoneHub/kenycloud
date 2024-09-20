import { Button } from "@/components/ui/button";
import { FileIcon, StarIcon } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container mx-auto pt-12"> {/*flex min-h-screen flex-col items-center justify-between p-24*/}

      <div className="flex gap-8">
        <div className="w-40 flex flex-col gap-4">
          <Link href="/dashboard/files">
            <Button variant={"link"} className="flex gap-2">
              <FileIcon/>Files
            </Button>
          </Link>

          <Link href="/dashboard/favorite">
            <Button variant={"link"} className="flex gap-2">
              <StarIcon/>Favorite
            </Button>
          </Link>
        </div>

        <div className="w-full">
          {children}
        </div>
      </div>
    </main>
  );
}