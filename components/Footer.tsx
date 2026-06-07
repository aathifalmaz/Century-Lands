"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-[#050b1a] text-white pt-16 pb-12 px-6 lg:px-20 relative overflow-hidden">

            {/* Top Section: Links Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 relative z-10">

                {/* Resources Section */}
                <div className="space-y-6">
                    <h4 className="text-lg font-bold text-white tracking-wider">Quick Links</h4>
                    <ul className="space-y-4 text-gray-400">
                        <li><Link href="/properties" className="hover:text-accent transition-colors">Featured Properties</Link></li>
                        <li><Link href="/properties" className="hover:text-accent transition-colors">Search Listings</Link></li>
                        <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Support</Link></li>
                    </ul>
                </div>

                {/* Legal Section */}
                <div className="space-y-6">
                    <h4 className="text-lg font-bold text-white tracking-wider">Legal</h4>
                    <ul className="space-y-4 text-gray-400">
                        <li><Link href="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms-of-service" className="hover:text-accent transition-colors">Terms of Service</Link></li>
                        <li><Link href="/cookie-policy" className="hover:text-accent transition-colors">Cookie Policy</Link></li>
                        <li><Link href="/brand-policy" className="hover:text-accent transition-colors">Brand Policy</Link></li>
                    </ul>
                </div>

                {/* Newsletter Section (Integrated) */}
                <div className="space-y-6 col-span-full md:col-span-2">
                    <h4 className="text-lg font-bold text-white tracking-wider">Newsletter</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Stay updated with our latest property listings and market insights.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Input
                            type="email"
                            placeholder="Email address"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg h-12 focus-visible:ring-accent"
                        />
                        <Button className="bg-primary hover:bg-secondary text-white font-bold h-12 rounded-lg transition-all duration-300">
                            <p className="text-lg">Subscribe</p>
                        </Button>
                    </div>
                </div>

            </div>

            {/* Middle Section: Contact & Socials */}
            <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-lg">
                    <span className="text-gray-400">How can we help?</span>
                    <Link href="/contact" className="font-bold text-white border-b-2 border-accent hover:text-accent transition-colors">
                        Contact us
                    </Link>
                </div>

                {/* Bottom Section: Branding & Copyright */}
                <div className="max-w-7xl mx-auto mt-12 text-center md:text-left relative z-10">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Century Lands & Homes (Pvt) Ltd. All rights reserved.
                    </p>
                </div>

                <div className="flex items-center gap-6 text-gray-400">
                    <a href="#" className="hover:text-white transition-colors"><Facebook size={22} /></a>
                    <a href="#" className="hover:text-white transition-colors"><Instagram size={22} /></a>
                    <a href="#" className="hover:text-white transition-colors"><Youtube size={22} /></a>
                    <a href="#" className="hover:text-white transition-colors"><Twitter size={22} /></a>
                    <a href="#" className="hover:text-white transition-colors"><Linkedin size={22} /></a>
                </div>
            </div>



            {/* Watermark Branding */}
            <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.03] whitespace-nowrap">
                <h2 className="text-[10vw] lg:text-[15vw] font-black text-white tracking-tighter uppercase leading-none">
                    Century
                </h2>
            </div>
        </footer>
    )
}
