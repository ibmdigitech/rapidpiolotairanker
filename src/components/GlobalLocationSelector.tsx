"use client";

import { useState } from "react";
import { Globe, ChevronDown, Monitor, Smartphone, Tablet } from "lucide-react";

const COUNTRIES = [
  { value: "United Arab Emirates", label: "UAE" },
  { value: "United States", label: "USA" },
  { value: "United Kingdom", label: "UK" },
  { value: "Saudi Arabia", label: "Saudi Arabia" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "India", label: "India" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
];

const CITIES = {
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah"],
  "United States": ["New York", "Los Angeles", "Chicago"],
  "United Kingdom": ["London", "Manchester", "Birmingham"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Dammam"],
  "Germany": ["Berlin", "Munich", "Hamburg"],
  "France": ["Paris", "Lyon", "Marseille"],
  "India": ["Mumbai", "Delhi", "Bangalore"],
  "Canada": ["Toronto", "Vancouver", "Montreal"],
  "Australia": ["Sydney", "Melbourne", "Brisbane"],
};

const LANGUAGES = ["English", "Arabic", "French", "German", "Spanish", "Portuguese"];
const SEARCH_ENGINES = {
  "English": ["Google.com", "Google UAE", "Google US", "Google UK", "ChatGPT", "Gemini", "Perplexity"],
  "Arabic": ["Google UAE", "Google Saudi Arabia", "Bing", "ChatGPT", "Gemini"],
  "French": ["Google.fr", "Google UAE", "ChatGPT", "Gemini"],
  "German": ["Google.de", "Google UAE", "ChatGPT", "Gemini"],
  "Spanish": ["Google.es", "Google UAE", "ChatGPT", "Gemini"],
  "Portuguese": ["Google.br", "Google UAE", "ChatGPT", "Gemini"],
};
const DEVICES = ["Mobile", "Desktop", "Tablet"];

export default function GlobalLocationSelector() {
  const [country, setCountry] = useState("United Arab Emirates");
  const [city, setCity] = useState("Dubai");
  const [language, setLanguage] = useState("English");
  const [searchEngine, setSearchEngine] = useState("Google UAE");
  const [device, setDevice] = useState("Mobile");


  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <div className="relative">
        <select
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            const firstCity = (CITIES as Record<string, string[]>)[e.target.value]?.[0] || "";
            setCity(firstCity);
          }}
          className="appearance-none bg-neutral-900 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-primary/50 pr-8"
        >
          {COUNTRIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <Globe className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="appearance-none bg-neutral-900 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-primary/50 pr-8"
        >
          {(CITIES as Record<string, string[]>)[country]?.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            setSearchEngine((SEARCH_ENGINES as Record<string, string[]>)[e.target.value]?.[0] || "Google UAE");
          }}
          className="appearance-none bg-neutral-900 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-primary/50 pr-8"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={searchEngine}
          onChange={(e) => setSearchEngine(e.target.value)}
          className="appearance-none bg-neutral-900 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-primary/50 pr-8"
        >
          {(SEARCH_ENGINES as Record<string, string[]>)[language]?.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={device}
          onChange={(e) => setDevice(e.target.value)}
          className="appearance-none bg-neutral-900 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-primary/50 pr-8 pl-8"
        >
          {DEVICES.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {device === "Desktop" && <Monitor className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />}
        {device === "Tablet" && <Tablet className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />}
        {device !== "Desktop" && device !== "Tablet" && <Smartphone className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />}
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}
