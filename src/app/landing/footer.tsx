import Image from "next/image";
import logoImg from "../../../public/image/KenyCloudFull.png"

export function Footer(){
    return (
        <footer className="bg-white rounded-lg shadow dark:bg-main-dark m-4 animate-fade-up animate-duration-700 animate-delay-[1400ms] animate-ease-in-out">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <Image src={logoImg} height="70" alt="KenyCloud Logo" className="drop-shadow-xl"/>
                    </a>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        <li>
                            <a href="https://feedback.qual.su" target="_blank" className="hover:underline me-4 md:me-6">Feedback</a>
                        </li>
                        <li>
                            <a href="https://qual.su" target="_blank" className="hover:underline me-4 md:me-6">Qualsu</a>
                        </li>
                        <li>
                            <a href="https://t.me/qualsu" target="_blank" className="hover:underline me-4 md:me-6">Telegram</a>
                        </li>
                        <li>
                            <a href="https://vk.com/qualsu" target="_blank" className="hover:underline md:me-6">VK</a>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2021-2024 <a href="https://copyright.qual.su" className="hover:underline">Qualsu</a></span>
            </div>
        </footer>
    )
}