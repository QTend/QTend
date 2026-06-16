"use client";

import React, { useState } from "react";
import { Phone, Mail, Globe, MapPin, Instagram, Twitter, ChevronDown } from "lucide-react";
import { useUserAdmin } from "@/context/UserAdminContext";



export default function General() {
  const {branch} = useUserAdmin()

  // Simple state to hold form values matching the image defaults
  const [formData, setFormData] = useState({
    name: branch.name,
    description: "Authentic Italian cuisine made with passion and fresh ingredients.",
    urlSlug: branch.slug,
    phone: "+33 6 12 34 56 78",
    email: "hello@bistrot-delicias.com",
    website: "bistrot-delicias.com",
    street: "123 Avenue des Champs-Elysées",
    city: "Paris",
    postalCode: "75008",
    country: "France",
    instagram: "instagram.com/bistrot-delicias",
    twitter: "twitter.com/bistrot-delicias",
    tiktok: "tiktok.com/@bistrot-delicias",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full ">
      {/* 1. Restaurant Info Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Restaurant Info</h2>
        <p className="text-sm text-slate-500 mb-6">Basic information about your restaurant</p>

        <div className="space-y-5">
          {/* Restaurant Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Restaurant name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* URL Slug */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">URL slug</label>
              <input
                type="text"
                name="urlSlug"
                value={formData.urlSlug}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Website</label>
              <div className="relative mb-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
              </div>
              <p className="text-[11px] text-slate-400">Optional. Will be put on main page.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Location Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Location</h2>
        <p className="text-sm text-slate-500 mb-6">Location information of your restaurant</p>

        <div className="space-y-5">
          {/* Street Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Street address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* City Dropdown */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
              <div className="relative">
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                >
                  <option value="Paris">Paris</option>
                  <option value="Lyon">Lyon</option>
                  <option value="Marseille">Marseille</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
          </div>

          {/* Country Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
            <div className="relative">
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              >
                <option value="France">France</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Social Media Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Social Media</h2>
        <p className="text-sm text-slate-500 mb-6">Social profiles of your restaurant</p>

        <div className="space-y-4">
          {/* Instagram */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-center w-10 h-full border-r border-slate-200 bg-slate-100">
              <Instagram size={16} className="text-[#E1306C]" />
            </div>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 focus:outline-none"
            />
          </div>

          {/* Twitter / X */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-center w-10 h-full border-r border-slate-200 bg-slate-100">
              <Twitter size={16} className="text-[#1DA1F2]" />
            </div>
            <input
              type="text"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 focus:outline-none"
            />
          </div>

          {/* TikTok (Using custom SVG) */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-center w-10 h-full border-r border-slate-200 bg-slate-100">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-black">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </div>
            <input
              type="text"
              name="tiktok"
              value={formData.tiktok}
              onChange={handleChange}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end">
        <button className="bg-[#68A544] hover:bg-green-700 transition-colors text-white px-6 py-2 rounded-md font-medium text-sm shadow-sm">
          Save changes
        </button>
      </div>
    </div>
  );
}