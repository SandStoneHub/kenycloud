import Image from 'next/image';
import img from "../../../public/error/403.png"
import imgRkn from "../../../public/error/403rkn.png"

export default function Page403(){
    const numbers: number = Math.floor(Math.random() * 36) + 1;

    return (
        <section className="flex justify-center md:flex-row flex-col items-center">
            <title>403 Forbidden</title>
            <Image src={numbers === 18 ? imgRkn : img} width="600" alt="" className="m-2 flex items-center"/>
            <div className="text-center md:text-left mx-2 mr-0 md:mr-32 mb-8">
                <h1 className="text-7xl md:text-8xl text-main-grey my-5 md:my-2 font-bold">
                    403
                </h1>

                <h3 className="text-2xl break-word max-w-[500px] text-gray-600 px-4 md:px-0">
                    Доступ запрещен
                </h3>
            </div>
        </section>
    )
}