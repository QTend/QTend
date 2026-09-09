"use client"

import React from 'react';
import { Clock, MonitorPlay, MessageCircle, Zap, Star, ShieldCheck, Users } from 'lucide-react';

export const DemoRequestLayout = () => {
    return (
        <section className="bg-gray-50 py-16 px-5 min-h-screen">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* ================= LEFT COLUMN: THE FORM ================= */}
                <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Book Your Free Demo</h2>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                        A QTend specialist will walk you through the platform live — tailored to your business.
                    </p>

                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                        {/* Name Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">First name</label>
                                <input type="text" placeholder="Marco" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0E8A54] focus:ring-1 focus:ring-[#0E8A54] transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Last name</label>
                                <input type="text" placeholder="Bernini" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0E8A54] focus:ring-1 focus:ring-[#0E8A54] transition-all" />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Work email</label>
                            <input type="email" placeholder="marco@trattoriacentrale.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0E8A54] focus:ring-1 focus:ring-[#0E8A54] transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone number</label>
                            <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0E8A54] focus:ring-1 focus:ring-[#0E8A54] transition-all" />
                        </div>

                        {/* Business Details */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Business type</label>
                            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-[#0E8A54] focus:ring-1 focus:ring-[#0E8A54] appearance-none cursor-pointer">
                                <option>Restaurant</option>
                                <option>Hotel / Resort</option>
                                <option>Bar / Lounge</option>
                                <option>Café</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Number of locations</label>
                            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-[#0E8A54] focus:ring-1 focus:ring-[#0E8A54] appearance-none cursor-pointer">
                                <option>1 location</option>
                                <option>2-5 locations</option>
                                <option>6+ locations</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Approximate number of tables</label>
                            <input type="text" placeholder="e.g. 24" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0E8A54] focus:ring-1 focus:ring-[#0E8A54] transition-all" />
                        </div>

                        {/* Optional Message */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Anything you'll like us to know? (optional)</label>
                            <textarea rows={3} placeholder="e.g. We run a rooftop bar and need to handle peak-hour rushes..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0E8A54] focus:ring-1 focus:ring-[#0E8A54] transition-all resize-none"></textarea>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="w-full bg-[#68A544] hover:bg-[#5b903c] text-white font-bold rounded-xl py-4 transition-colors active:scale-[0.99] shadow-sm mt-4">
                            Request My Demo
                        </button>
                        <p className="text-center text-[11px] text-gray-400 mt-4 font-medium">
                            We'll get back to you within 1 business day. No spam, ever.
                        </p>
                    </form>
                </div>

                {/* ================= RIGHT COLUMN: SIDEBAR INFO ================= */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    
                    {/* What to expect Card */}
                    <div className="bg-[#18181B] rounded-3xl p-8 text-white shadow-lg">
                        <h3 className="font-bold text-lg mb-6">What to expect</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-orange-500/10 p-2 rounded-lg shrink-0 text-[#F97316]">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold mb-1">30-minute session</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">A focused, no-fluff walkthrough of QTend tailored to your venue type.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-orange-500/10 p-2 rounded-lg shrink-0 text-[#F97316]">
                                    <MonitorPlay size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold mb-1">Live product demo</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">See the guest ordering flow, kitchen dashboard, and analytics in action.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-orange-500/10 p-2 rounded-lg shrink-0 text-[#F97316]">
                                    <MessageCircle size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold mb-1">Q&A with a specialist</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">Ask anything: integrations, pricing, setup timeline, or custom needs.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-orange-500/10 p-2 rounded-lg shrink-0 text-[#F97316]">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold mb-1">Same-day setup possible</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">If you're ready to go, we can have you live before the call ends.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial Card */}
                    <div className="bg-[#F97316] rounded-3xl p-8 text-white shadow-md shadow-orange-500/20">
                        <div className="flex gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={16} className="fill-white text-white" />
                            ))}
                        </div>
                        <p className="text-sm font-medium leading-relaxed mb-6">
                            "The demo took 25 minutes and I was live the same afternoon. Best decision I made for my restaurant this year."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-300 rounded-full overflow-hidden shrink-0">
                                {/* Placeholder Avatar */}
                                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Sofia&backgroundColor=transparent`} alt="Sofia" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Sofia Marchetti</p>
                                <p className="text-[11px] text-orange-100">Owner, Osteria Blu - Milan</p>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                <ShieldCheck size={18} className="text-[#0E8A54]" />
                                Your data is 100% secure and never shared
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                <Clock size={18} className="text-[#0E8A54]" />
                                Response within 1 business day
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                <Users size={18} className="text-[#0E8A54]" />
                                1,200+ hospitality businesses trust QTend
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};