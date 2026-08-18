import { Analytics } from "@/components/site/home/Analytics"
import { Benefits } from "@/components/site/home/Benefits"
import { Brief } from "@/components/site/home/Brief"
import { Experience } from "@/components/site/home/Experience"
import { Industries } from "@/components/site/home/Industries"
import { Product } from "@/components/site/home/Product"
import { SocialProof } from "@/components/site/home/SocialProof"
import { PlatformHeroSplit } from "@/components/site/resources/Hero"
import { HowItWorksTimeline } from "@/components/site/resources/HowItWorksTimeline"
import { PlatformOverview } from "@/components/site/resources/PlatformOverview"


const page = () => {
  return (
    <>
    <PlatformHeroSplit />
    <Brief bgcolor="#F7F7F7" />
    <PlatformOverview />
    <HowItWorksTimeline />
    <Product />
    <Benefits />
    <Analytics />
    <Industries />
    <SocialProof />
    <Experience />
    </>
  )
}

export default page