import Image from 'next/image';
import img from "../../../public/error/500.png"

export default function Page500(){
    return (
        <section className="flex justify-center md:flex-row flex-col items-center">
            <title>500 Internal server error</title>
            <Image src={img} width="600" alt="" className="m-2 md:mr-2 flex items-center"/>
            <div className="text-center md:text-left mx-2 mb-8">
                <h1 className="text-7xl md:text-8xl text-main-grey my-5 md:my-2 font-bold">
                    500
                </h1>

                <h3 className="text-2xl break-word max-w-[500px] text-gray-600 px-4 md:px-0">
                    Internal server error
                </h3>
            </div>
        </section>
    )
}