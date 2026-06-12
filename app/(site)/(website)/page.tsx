import { Brief } from "@/components/site/home/Brief";
import Hero from "@/components/site/home/Hero";
import { Problem } from "@/components/site/home/Problem";
import { Navbar } from "@/components/site/layout/Navbar";

export default function Home(){
  return(
    <>
    <Hero />
    <Brief />
    <Problem />
    </>
  )
}