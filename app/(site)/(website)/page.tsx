import { Benefits } from "@/components/site/home/Benefits";
import { Brief } from "@/components/site/home/Brief";
import { Features } from "@/components/site/home/Features";
import Hero from "@/components/site/home/Hero";
import { Industries } from "@/components/site/home/Industries";
import { Problem } from "@/components/site/home/Problem";
import { Product } from "@/components/site/home/Product";
import { Solution } from "@/components/site/home/Solution";


export default function Home(){
  return(
    <>
    <Hero />
    <Brief />
    <Problem />
    <Solution />
    <Product />
    <Benefits />
    <Industries />
    <Features />
    </>
  )
}