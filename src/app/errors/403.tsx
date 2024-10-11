import Image from 'next/image';
import img from "../../../public/image/error/404.png"

export default function Page403(){
    return (
        <section className="flex justify-center md:flex-row flex-col items-center">
            <title>403 Forbidden</title>
            <Image src={img} width="600" alt="" className="m-2 md:mr-2 flex items-center"/>
            <div className="text-center md:text-left mx-2 mb-8">
                <h1 className="text-7xl md:text-8xl text-main-grey my-5 md:my-2 font-bold">
                    403
                </h1>

                <h3 className="text-2xl break-word max-w-[500px] text-gray-600 px-4 md:px-0">
                    Kenycloud не доступен в вашем регионе
                </h3>
            </div>
        </section>
    )
}