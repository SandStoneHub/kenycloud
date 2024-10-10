"use client"

import { Footer } from "./landing/footer";
import { Header } from "./landing/header";
import { useEffect } from 'react';
import Main from "./landing/main";

export default function Landing(){

    useEffect(() => {
        const header = document.querySelector<HTMLElement>('.main-header')
        if (header) {
          header.style.display = 'none'
        }
      }, [])
    
    return (
        <>
            <div className="animate-fade-down animate-duration-700 animate-delay-[1000ms] animate-ease-in-out">
                <Header/>
            </div>
            <Main/>
            <Footer/>
        </>
    )
}