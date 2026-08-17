import Analytics from "@/components/site/features/Analytics"
import Banner from "@/components/site/features/Banner"
import Hero from "@/components/site/features/Hero"
import Kitchen from "@/components/site/features/Kitchen"
import Management from "@/components/site/features/Management"
import QR_Ordering from "@/components/site/features/QR_Ordering"
import { Experience } from "@/components/site/home/Experience"
import { Features } from "@/components/site/home/Features"
import { 
    QrCode, Zap, Smartphone, RefreshCw, Lock, 
    CheckCircle2, Monitor, Bell, Shield, Edit, 
    DollarSign, Clock, Star, Users, TrendingUp, Download, LayoutDashboard 
} from 'lucide-react'
import Link from 'next/link'


const page = () => {
  return (
    <>
    <Hero />
    <QR_Ordering />
    <Management />
    <Banner />
    <Kitchen />
    <Analytics />
    <Features />
    <Experience />
    </>
  )
}

export default page