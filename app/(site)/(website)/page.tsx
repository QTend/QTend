import { Analytics } from "@/components/site/home/Analytics";
import { Benefits } from "@/components/site/home/Benefits";
import { Brief } from "@/components/site/home/Brief";
import { Experience } from "@/components/site/home/Experience";
import { Faq } from "@/components/site/home/Faq";
import { Features } from "@/components/site/home/Features";
import Hero from "@/components/site/home/Hero";
import { Industries } from "@/components/site/home/Industries";
import { Pricing } from "@/components/site/home/Pricing";
import { Problem } from "@/components/site/home/Problem";
import { Product } from "@/components/site/home/Product";
import { SocialProof } from "@/components/site/home/SocialProof";
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
    <SocialProof />
    <Analytics />
    <Pricing />
    <Faq />
    <Experience />
    </>
  )
}