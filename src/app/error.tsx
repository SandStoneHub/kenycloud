"use client"

import React from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import img from "../../public/image/error/500.png"

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

const Error500: React.FC<ErrorPageProps> = ({ error, reset }) => {
  useEffect(() => {
    console.error('Произошла ошибка 500:', error);
  }, [error]);

  return (
    <section className="flex justify-center md:flex-row flex-col items-center">
      <title>500 Internal server error</title>
      <Image src={img} width="600" alt="" className="m-2 md:mr-2 flex items-center"/>
      <div className="text-center md:text-left mx-2 mb-8">
          <h1 className="text-7xl md:text-8xl text-main-grey my-5 md:my-2 font-bold">
              500
          </h1>

          <h3 className="text-2xl break-word max-w-[500px] text-gray-600 px-4 md:px-0">
            Упсс...
          </h3>

          <Link href="/" className="text-gray-500 hover:text-gray-600">
            На главную
          </Link>
      </div>
    </section>
  );
};

export default Error500;
