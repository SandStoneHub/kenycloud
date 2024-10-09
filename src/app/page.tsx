import { Footer } from "./landing/footer";
import Image from "next/image";
import img from "../../public/Landing.png"
import { Button } from "@/components/ui/button";

export default function Landing(){
    return (
        <>
            <section className="flex justify-center md:flex-row flex-col items-center mt-12">
                <Image src={img} width="700" alt="" className="m-2 md:mr-2 animate-fade-right animate-duration-1000 animate-delay-[1800ms] animate-ease-in-out"/>
                <div className="text-center md:text-left mt-6 mx-2 animate-fade-left animate-duration-1000 animate-delay-[1800ms] animate-ease-in-out">
                    <h1 className="text-5xl lg:text-6xl text-white my-5 md:my-2">
                        <div className="text-main-whitedark font-bold flex items-center justify-center md:justify-normal">
                            <span className="text-main-grey">Keny</span>Cloud
                        </div>
                    </h1>
                    <h3 className="text-2xl break-word max-w-[500px] text-gray-600 px-4 md:px-0">Open source Файловое хранилище</h3>
                    <a href="/dashboard/files">
                        <Button className="mt-2">Перейти</Button>
                    </a>
                </div>
            </section>

            <Footer/>
        </>
    )
}