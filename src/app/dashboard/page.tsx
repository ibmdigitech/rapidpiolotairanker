"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import {
  Rocket, Search, Brain, PenTool, BarChart3, LineChart,
  Settings, LogOut, CheckCircle2, AlertTriangle, ShieldCheck,
  Plus, AlertCircle, RefreshCw, Layers, Bookmark, Trash2, Copy, Check, Edit2, Save,
  Download, Code2, FileJson, ChevronDown, X, Eye, ClipboardCheck, Info, Loader2,
  DollarSign, BadgeDollarSign, ToggleLeft, ToggleRight, PlusCircle, MousePointer, TrendingUp
  } from "lucide-react";
import GlobalLocationSelector from "@/components/GlobalLocationSelector";
import { InlineAdBanner } from "@/components/ads";
import {
  SCHEMA_TYPES, SchemaType, FaqItem, createEmptyFaqItem,
  getFieldsForType, buildSchema, validateSchema,
  calculateContentQuality, type ValidationCheck, type QualityResult
} from "@/lib/schema-builder";

interface SavedArticle {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface SavedSchema {
  id: string;
  question: string;
  answer: string;
  json: string;
  createdAt: string;
}

interface KeywordItem {
  word: string;
  vol: string;
  diff: string;
  rate: string;
  cpc?: string;
}

interface CompetitorData {
  domainUrl: string;
  seoScore: number;
  aeoScore: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  auditIssues: any[];
  scannedAt: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | { displayName: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [domainUrl, setDomainUrl] = useState("mybusiness.ae");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  // AI Composer State
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [composerTitle, setComposerTitle] = useState("");
  const [composerLang, setComposerLang] = useState("English");
  const [composerTone, setComposerTone] = useState("Professional");
  const [composerMinWords, setComposerMinWords] = useState("");
  const [composerMaxWords, setComposerMaxWords] = useState("800");
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [copiedArticleId, setCopiedArticleId] = useState<string | null>(null);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [editingArticleTitle, setEditingArticleTitle] = useState("");
  const [editingArticleContent, setEditingArticleContent] = useState("");

  // AEO Schema Builder State
  const [selectedSchemaType, setSelectedSchemaType] = useState<SchemaType>("FAQ");
  const [faqItems, setFaqItems] = useState<FaqItem[]>([createEmptyFaqItem()]);
  const [schemaFields, setSchemaFields] = useState<Record<string, string>>({});
  const [generatedSchema, setGeneratedSchema] = useState("");
  const [savedSchemas, setSavedSchemas] = useState<SavedSchema[]>([]);
  const [copiedSchema, setCopiedSchema] = useState<"json" | "html" | null>(null);
  const [schemaValidation, setSchemaValidation] = useState<ValidationCheck[]>([]);
  const [isGeneratingSchema, setIsGeneratingSchema] = useState(false);
  const [schemaErrors, setSchemaErrors] = useState<Record<string, string>>({});
  const [showSchemaTypeDropdown, setShowSchemaTypeDropdown] = useState(false);

  // Keywords State
  const [keywordQuery, setKeywordQuery] = useState("");
  const [isSearchingKeywords, setIsSearchingKeywords] = useState(false);
  const [keywordsList, setKeywordsList] = useState<KeywordItem[]>([
    { word: "seo agency dubai", vol: "2,400/mo", diff: "48%", rate: "12% citation", cpc: "$3.50" },
    { word: "aeo optimization services", vol: "850/mo", diff: "22%", rate: "45% citation", cpc: "$5.20" },
    { word: "real estate marketing uae", vol: "1,900/mo", diff: "64%", rate: "8% citation", cpc: "$4.10" },
    { word: "chatgpt visibility tracker", vol: "350/mo", diff: "14%", rate: "67% citation", cpc: "$2.80" },
  ]);

  // Competitor Analysis State
  const [competitorInput, setCompetitorInput] = useState("");
  const [isScanningCompetitor, setIsScanningCompetitor] = useState(false);
  const [competitorData, setCompetitorData] = useState<CompetitorData | null>(null);
  const [competitorError, setCompetitorError] = useState("");

  // Monetization State
  const [monetizationSettings, setMonetizationSettings] = useState<Record<string, unknown>>({});
  const [ads, setAds] = useState<Record<string, unknown>[]>([]);
  const [monetizationTab, setMonetizationTab] = useState("overview");
  const [adForm, setAdForm] = useState<Record<string, unknown>>({});
  const [consentGiven, setConsentGiven] = useState<Record<string, boolean>>({ necessary: true, analytics: false, advertising: false });

  const router = useRouter();

  // Project data state
  const [seoScore, setSeoScore] = useState(0);
  const [aeoScore, setAeoScore] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [auditIssues, setAuditIssues] = useState<any[]>([]);

  // Auth Guard & Data Fetch
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Fetch User Project Data from Firestore
        try {
          const userDocRef = doc(db, "projects", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setDomainUrl(data.domainUrl || "mybusiness.ae");
            setSeoScore(data.seoScore || 0);
            setAeoScore(data.aeoScore || 0);
            setAuditIssues(data.auditIssues || []);
            setSavedArticles(data.savedArticles || []);
            setSavedSchemas(data.savedSchemas || []);
            if (data.savedKeywords && data.savedKeywords.length > 0) {
              setKeywordsList(data.savedKeywords);
            }
          } else {
            // Initialize new user project
            const defaultProject = {
              domainUrl: "mybusiness.ae",
              seoScore: 0,
              aeoScore: 0,
              auditIssues: [],
              savedArticles: [],
              savedSchemas: [],
              savedKeywords: [],
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, defaultProject);
          }
        } catch (error) {
          console.error("Error fetching project data:", error);
        }

        setLoading(false);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Load monetization settings and ads
  useEffect(() => {
    if (!user || !('uid' in user)) return;
    const unsubSettings = () => {};
    const unsubAds = () => {};
    (async () => {
      try {
        const settingsRef = doc(db, "monetizationSettings", user.uid);
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) setMonetizationSettings(settingsSnap.data() as Record<string, unknown>);

        const adsRef = collection(db, "advertisements");
        const adsSnap = await getDocs(adsRef);
        const adList = adsSnap.docs
          .filter((d) => !(d.data() as Record<string, unknown>).deleted)
          .map((d) => ({ id: d.id, ...d.data() } as Record<string, unknown>));
        setAds(adList);
      } catch (error) {
        console.error("Error loading monetization:", error);
      }
    })();
    return () => { unsubSettings(); unsubAds(); };
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const startAnalysis = async () => {
    if (!domainUrl || !user || !('uid' in user)) return;
    
    setIsScanning(true);
    setScanProgress(15);
    
    try {
      const progressInterval = setInterval(() => {
        setScanProgress(prev => (prev < 85 ? prev + 10 : prev));
      }, 500);

      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainUrl, userId: user.uid }),
      });

      clearInterval(progressInterval);
      setScanProgress(100);

      if (res.ok) {
        const { data } = await res.json();
        
        setSeoScore(data.seoScore);
        setAeoScore(data.aeoScore);
        setAuditIssues(data.auditIssues);
        
        const userDocRef = doc(db, "projects", user.uid);
        await setDoc(userDocRef, {
          domainUrl: data.domainUrl,
          seoScore: data.seoScore,
          aeoScore: data.aeoScore,
          auditIssues: data.auditIssues,
          lastScanned: data.scannedAt
        }, { merge: true });
      } else {
        console.error("Scan failed");
      }
    } catch (error) {
      console.error("Error during scan:", error);
    } finally {
      setTimeout(() => setIsScanning(false), 500);
    }
  };

  const handleGenerate = async () => {
    const title = composerTitle.trim() || "Best SEO Strategies for Dubai Real Estate in 2026";
    setIsGenerating(true);
    setGeneratedContent("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minWords: composerMinWords ? parseInt(composerMinWords, 10) : undefined,
          maxWords: composerMaxWords ? parseInt(composerMaxWords, 10) : undefined,
          messages: [
            { 
              role: "system", 
              content: `You are an expert SEO and AEO content writer. Write structured, actionable content in ${composerLang} using a ${composerTone} tone.` 
            },
            { role: "user", content: `Write an SEO-optimized article about: ${title}` },
          ],
        }),
      });
      const data = await res.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        setGeneratedContent(data.choices[0].message.content);
      } else {
        setGeneratedContent("Error: " + JSON.stringify(data));
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setGeneratedContent("Error: " + message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveArticle = async () => {
    if (!generatedContent || !user || !('uid' in user)) return;
    const newArticle: SavedArticle = {
      id: Date.now().toString(),
      title: composerTitle.trim() || "Untitled Article",
      content: generatedContent,
      createdAt: new Date().toLocaleDateString(),
    };
    const updated = [newArticle, ...savedArticles];
    setSavedArticles(updated);
    try {
      const userDocRef = doc(db, "projects", user.uid);
      await setDoc(userDocRef, { savedArticles: updated }, { merge: true });
    } catch (e) {
      console.error("Error saving article:", e);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!user || !('uid' in user)) return;
    const updated = savedArticles.filter(a => a.id !== id);
    setSavedArticles(updated);
    try {
      const userDocRef = doc(db, "projects", user.uid);
      await setDoc(userDocRef, { savedArticles: updated }, { merge: true });
    } catch (e) {
      console.error("Error deleting article:", e);
    }
  };

  const handleUpdateArticle = async (id: string) => {
    if (!user || !('uid' in user)) return;
    const updated = savedArticles.map(a => 
      a.id === id ? { ...a, title: editingArticleTitle, content: editingArticleContent } : a
    );
    setSavedArticles(updated);
    setEditingArticleId(null);
    try {
      const userDocRef = doc(db, "projects", user.uid);
      await setDoc(userDocRef, { savedArticles: updated }, { merge: true });
    } catch (e) {
      console.error("Error updating article:", e);
    }
  };

  // ─── Schema Builder Derived State ────────────────────────────────────────
  const currentFields = useMemo(() => getFieldsForType(selectedSchemaType), [selectedSchemaType]);

  const qualityResult: QualityResult = useMemo(() => {
    return calculateContentQuality(selectedSchemaType, schemaFields, faqItems);
  }, [selectedSchemaType, schemaFields, faqItems]);

  // ─── Schema Builder Handlers ────────────────────────────────────────────
  const handleSchemaTypeChange = (type: SchemaType) => {
    setSelectedSchemaType(type);
    setSchemaFields({});
    setFaqItems([createEmptyFaqItem()]);
    setGeneratedSchema("");
    setSchemaValidation([]);
    setSchemaErrors({});
    setShowSchemaTypeDropdown(false);
  };

  const handleAddFaqItem = () => {
    setFaqItems([...faqItems, createEmptyFaqItem()]);
  };

  const handleRemoveFaqItem = (id: string) => {
    if (faqItems.length <= 1) return;
    setFaqItems(faqItems.filter((item) => item.id !== id));
  };

  const handleFaqChange = (id: string, field: "question" | "answer", value: string) => {
    setFaqItems(faqItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    // Clear errors for this field
    setSchemaErrors((prev) => {
      const next = { ...prev };
      delete next[`${id}-${field}`];
      return next;
    });
  };

  const handleFieldChange = (key: string, value: string) => {
    setSchemaFields((prev) => ({ ...prev, [key]: value }));
    setSchemaErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateFormInputs = (): boolean => {
    const errors: Record<string, string> = {};
    if (selectedSchemaType === "FAQ") {
      // Check for empty questions/answers
      faqItems.forEach((item) => {
        if (!item.question.trim()) errors[`${item.id}-question`] = "Question is required";
        if (!item.answer.trim()) errors[`${item.id}-answer`] = "Answer is required";
      });
      // Check for duplicates
      const questions = faqItems.map((i) => i.question.trim().toLowerCase()).filter(Boolean);
      const seen = new Set<string>();
      questions.forEach((q, idx) => {
        if (seen.has(q)) {
          errors[`${faqItems[idx].id}-question`] = "Duplicate question";
        }
        seen.add(q);
      });
    } else {
      // Validate required fields
      currentFields.filter((f) => f.required).forEach((f) => {
        if (!schemaFields[f.key]?.trim()) {
          errors[f.key] = `${f.label} is required`;
        }
      });
    }
    setSchemaErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerateSchema = () => {
    if (!validateFormInputs()) return;
    setIsGeneratingSchema(true);
    // Small delay for UX polish
    setTimeout(() => {
      try {
        const schema = buildSchema(selectedSchemaType, schemaFields, faqItems);
        const jsonString = JSON.stringify(schema, null, 2);
        setGeneratedSchema(jsonString);
        setSchemaValidation(validateSchema(jsonString, selectedSchemaType));
      } catch {
        setGeneratedSchema("");
        setSchemaValidation([{ label: "Schema generation", passed: false, message: "Failed to generate schema" }]);
      } finally {
        setIsGeneratingSchema(false);
      }
    }, 400);
  };

  const handleCopySchema = async (mode: "json" | "html") => {
    try {
      const text = mode === "html"
        ? `<script type="application/ld+json">\n${generatedSchema}\n</script>`
        : generatedSchema;
      await navigator.clipboard.writeText(text);
      setCopiedSchema(mode);
      setTimeout(() => setCopiedSchema(null), 2000);
    } catch {
      // Fallback copy
      const ta = document.createElement("textarea");
      ta.value = mode === "html" ? `<script type="application/ld+json">\n${generatedSchema}\n</script>` : generatedSchema;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedSchema(mode);
      setTimeout(() => setCopiedSchema(null), 2000);
    }
  };

  const handleDownloadSchema = () => {
    const blob = new Blob([generatedSchema], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `schema-${selectedSchemaType.toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ─── Monetization Handlers ───────────────────────────────────────────────
  const saveSetting = async (key: string, value: unknown) => {
    if (!user || !('uid' in user)) return;
    const updated = { ...monetizationSettings, [key]: value, updatedAt: new Date().toLocaleString() };
    setMonetizationSettings(updated);
    const userDocRef = doc(db, "monetizationSettings", user.uid);
    await setDoc(userDocRef, updated, { merge: true });
  };

  const handleSaveAd = async () => {
    if (!user || !('uid' in user)) return;
    const adId = (adForm.id as string) || `ad_${Date.now()}`;
    const adData: Record<string, unknown> = { ...adForm, id: adId, updatedAt: new Date().toLocaleString() };
    if (!(adData.name as string)) return;    const existing = ads.find((a: Record<string, unknown>) => a.id === adId);
    const newAds = existing ? ads.map((a: Record<string, unknown>) => a.id === adId ? adData : a) : [...ads, adData];
    setAds(newAds);
    await setDoc(doc(db, "advertisements", adId), adData, { merge: true });
    setAdForm({});
  };

  const deleteAd = async (id: string) => {
    if (!user || !('uid' in user)) return;
    const newAds = ads.filter((a: Record<string, unknown>) => a.id !== id);
    setAds(newAds);
    await setDoc(doc(db, "advertisements", id), { deleted: true }, { merge: true });
  };

  const handleSaveSchema = async () => {
    if (!generatedSchema || !user || !('uid' in user)) return;
    const label = selectedSchemaType === "FAQ"
      ? faqItems[0]?.question || "FAQ Schema"
      : schemaFields.name || schemaFields.headline || `${selectedSchemaType} Schema`;
    const newSchema: SavedSchema = {
      id: Date.now().toString(),
      question: label,
      answer: selectedSchemaType,
      json: generatedSchema,
      createdAt: new Date().toLocaleDateString(),
    };
    const updated = [newSchema, ...savedSchemas];
    setSavedSchemas(updated);
    try {
      const userDocRef = doc(db, "projects", user.uid);
      await setDoc(userDocRef, { savedSchemas: updated }, { merge: true });
    } catch (e) {
      console.error("Error saving schema:", e);
    }
  };

  const handleDeleteSchema = async (id: string) => {
    if (!user || !('uid' in user)) return;
    const updated = savedSchemas.filter(s => s.id !== id);
    setSavedSchemas(updated);
    try {
      const userDocRef = doc(db, "projects", user.uid);
      await setDoc(userDocRef, { savedSchemas: updated }, { merge: true });
    } catch (e) {
      console.error("Error deleting schema:", e);
    }
  };

  const handleSearchKeywords = async () => {
    if (!keywordQuery.trim()) return;
    setIsSearchingKeywords(true);
    try {
      const res = await fetch(`/api/keywords?q=${encodeURIComponent(keywordQuery)}`);
      const data = await res.json();
      if (data.keywords) {
        setKeywordsList(data.keywords);
        if (user && 'uid' in user) {
          const userDocRef = doc(db, "projects", user.uid);
          await setDoc(userDocRef, { savedKeywords: data.keywords }, { merge: true });
        }
      }
    } catch (e) {
      console.error("Error fetching keywords:", e);
    } finally {
      setIsSearchingKeywords(false);
    }
  };

  const handleScanCompetitor = async () => {
    if (!competitorInput.trim()) return;
    setIsScanningCompetitor(true);
    setCompetitorError("");
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainUrl: competitorInput }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setCompetitorData(json.data);
      } else {
        setCompetitorError(json.error || "Failed to scan competitor domain");
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setCompetitorError(message);
    } finally {
      setIsScanningCompetitor(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-foreground">
      
      {/* 1. Sidebar Nav */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-neutral-950 flex flex-col justify-between shrink-0 md:sticky md:top-0 md:h-screen z-20">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-white/5 flex items-center space-x-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
              <Rocket className="h-4.5 w-4.5 text-background font-bold" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-white">
              RankPilot<span className="text-accent font-extrabold">.AI</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 md:p-4 flex overflow-x-auto md:flex-col space-x-2 md:space-x-0 md:space-y-1.5 scrollbar-hide">
             {[
              { id: "overview", label: "Dashboard Overview", icon: Layers },
              { id: "audit", label: "SEO Site Audit", icon: Search },
              { id: "aeo", label: "AEO Optimization", icon: Brain },
              { id: "generator", label: "AI Semantic Composer", icon: PenTool },
              { id: "keywords", label: "Keyword Research", icon: BarChart3 },
              { id: "competitors", label: "Competitor Analysis", icon: LineChart },
              { id: "monetization", label: "Monetization", icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 w-auto md:w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === tab.id 
                      ? "bg-primary/10 text-white border border-primary/20" 
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`h-4 w-4 md:h-4.5 md:w-4.5 ${activeTab === tab.id ? "text-accent" : ""}`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile logout panel */}
        <div className="hidden md:block p-4 border-t border-white/5">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 mb-2">
            <div>
              <p className="text-xs font-semibold text-white truncate max-w-[120px]">{user?.displayName || "Pro User"}</p>
              <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{user?.email}</p>
            </div>
            <button className="p-1 text-muted-foreground hover:text-white"><Settings className="h-4 w-4" /></button>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-white/5 hover:bg-destructive/10 hover:text-destructive-foreground text-xs font-semibold text-muted-foreground transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main content viewport */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto max-h-screen no-scrollbar">
        {/* Top Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 pb-6 border-b border-white/5 gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-white">Project Domain Management</h1>
            <p className="text-xs text-muted-foreground mt-1">Audit scorecards, semantic tools, and crawl structures</p>
          </div>
          {/* Domain Input Field */}
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={domainUrl}
              onChange={(e) => setDomainUrl(e.target.value)}
              className="bg-neutral-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
            />
            <button
              onClick={startAnalysis}
              disabled={isScanning}
              className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-background font-bold text-xs rounded-xl flex items-center space-x-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${isScanning ? "animate-spin" : ""}`} />
              <span>{isScanning ? `Crawling ${scanProgress}%` : "Run Scan"}</span>
            </button>
          </div>
        </header>

        {/* Overview Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Inline Ad for Free Users */}
            <InlineAdBanner placement="dashboard_overview_top" />

            {/* Score Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Traditional SEO Score */}
              <div className="glass-card rounded-2xl p-6 border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Traditional SEO Score</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${seoScore >= 80 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" : "bg-amber-500/10 text-amber-400 border-amber-500/10"}`}>
                    {seoScore >= 80 ? "Optimized" : "Action Needed"}
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-heading font-black text-white">{seoScore}</span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-6 overflow-hidden">
                  <div className="bg-accent h-1.5 rounded-full transition-all duration-500" style={{ width: `${seoScore}%` }} />
                </div>
              </div>

              {/* Card 2: AEO AI Visibility Index */}
              <div className="glass-card rounded-2xl p-6 border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">AI Visibility Index (AEO)</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${aeoScore >= 80 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" : "bg-amber-500/10 text-amber-400 border-amber-500/10"}`}>
                    {aeoScore >= 80 ? "Optimized" : "Action Needed"}
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-heading font-black text-white">{aeoScore}</span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-6 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full transition-all duration-500" style={{ width: `${aeoScore}%` }} />
                </div>
              </div>

              {/* Card 3: Indexed Pages */}
              <div className="glass-card rounded-2xl p-6 border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Live Domain Status</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded">Connected</span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-heading font-bold text-white truncate">{domainUrl}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-muted-foreground mt-8">
                  <ShieldCheck className="h-4.5 w-4.5 text-accent" />
                  <span>Real-time scanner active</span>
                </div>
              </div>
            </div>

            {/* Content Split Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Audit Checklist Column */}
              <div className="lg:col-span-2 glass-card rounded-2xl p-6 border-white/5">
                <h3 className="font-heading font-bold text-lg text-white mb-6">Actionable SEO Audit Fix List</h3>
                {auditIssues.length === 0 ? (
                  <div className="p-8 text-center bg-neutral-900/50 rounded-xl border border-dashed border-white/5 text-muted-foreground">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm">No issues found or domain not scanned yet. Click &quot;Run Scan&quot; to start!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {auditIssues.map((issue) => (
                      <div key={issue.id} className="flex items-center justify-between p-4 rounded-xl bg-neutral-900 border border-white/5">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className={`h-5 w-5 shrink-0 ${issue.priority === "High" ? "text-red-500" : "text-amber-500"}`} />
                          <div>
                            <p className="text-sm font-semibold text-white">{issue.title}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Found in {issue.page}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${issue.priority === "High" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>
                          {issue.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar Quick Action Widgets */}
              <div className="glass-card rounded-2xl p-6 border-white/5 space-y-6">
                <h3 className="font-heading font-bold text-lg text-white">Visibility Checklist</h3>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4.5 w-4.5 text-accent" />
                    <span>Schema Markup JSON-LD verified</span>
                  </li>
                  <li className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4.5 w-4.5 text-accent" />
                    <span>Real-time crawler online</span>
                  </li>
                  <li className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <AlertCircle className={`h-4.5 w-4.5 ${aeoScore >= 80 ? "text-emerald-400" : "text-amber-400"}`} />
                    <span>AEO Score: {aeoScore}/100</span>
                  </li>
                  <li className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4.5 w-4.5 text-accent" />
                    <span>Firebase Storage connected</span>
                  </li>
                </ul>
                <button
                  onClick={() => setActiveTab("aeo")}
                  className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-white/5 font-semibold text-xs text-white transition-colors cursor-pointer"
                >
                  Configure AI AEO Schemas →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Audit Tab */}
        {activeTab === "audit" && (
          <div className="glass-card rounded-2xl p-4 md:p-6 border-white/5 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="font-heading font-bold text-xl text-white">Technical SEO Site Audit</h2>
                <p className="text-xs text-muted-foreground mt-1">Live HTML analysis of {domainUrl}</p>
              </div>
              <button 
                onClick={startAnalysis} 
                disabled={isScanning}
                className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-background text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? "animate-spin" : ""}`} />
                <span>{isScanning ? "Scanning..." : "Re-scan Domain"}</span>
              </button>
            </div>

            {auditIssues.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground border border-dashed border-white/10 rounded-xl bg-neutral-900/50">
                <Search className="h-8 w-8 text-muted-foreground/60 mx-auto mb-4" />
                <p className="text-sm font-semibold">Ready to run full domain audit scanner</p>
                <button onClick={startAnalysis} className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl cursor-pointer">Start System Crawl</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auditIssues.map((issue) => (
                  <div key={issue.id} className="p-4 rounded-xl bg-neutral-900 border border-white/5 flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className={`h-5 w-5 mt-0.5 ${issue.priority === "High" ? "text-red-500" : "text-amber-500"}`} />
                      <div>
                        <h4 className="text-sm font-semibold text-white">{issue.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">Location: {issue.page}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${issue.priority === "High" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>
                      {issue.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AEO Schema Builder Tab */}
        {activeTab === "aeo" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="glass-card rounded-2xl p-6 border-white/5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="font-heading font-bold text-2xl text-white flex items-center gap-2">
                    <Brain className="h-6 w-6 text-accent" />
                    AEO Schema Builder
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">Create structured, machine-readable content for search engines and AI systems.</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Generate valid Schema.org JSON-LD from your content and make important website information easier for machines to understand.</p>
                </div>
                {generatedSchema && (
                  <button
                    onClick={handleSaveSchema}
                    className="flex items-center gap-2 px-4 py-2.5 bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    Save to Project
                  </button>
                )}
              </div>
            </div>

            {/* Main Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT COLUMN: Builder Form */}
              <div className="space-y-6">
                {/* Schema Type Selector */}
                <div className="glass-card rounded-2xl p-6 border-white/5">
                  <label id="schema-type-label" className="block text-xs font-bold uppercase text-muted-foreground mb-3">Schema Type</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowSchemaTypeDropdown(!showSchemaTypeDropdown)}
                      aria-labelledby="schema-type-label"
                      aria-expanded={showSchemaTypeDropdown}
                      className="w-full flex items-center justify-between px-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-sm text-white hover:border-primary/40 transition-colors cursor-pointer focus:outline-none focus:border-primary/60"
                    >
                      <div className="flex items-center gap-2">
                        <FileJson className="h-4 w-4 text-accent" />
                        <span className="font-semibold">{selectedSchemaType}</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showSchemaTypeDropdown ? "rotate-180" : ""}`} />
                    </button>
                    {showSchemaTypeDropdown && (
                      <div className="absolute z-30 w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                        {SCHEMA_TYPES.map((type) => (
                          <button
                            key={type}
                            onClick={() => handleSchemaTypeChange(type)}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer hover:bg-white/5 ${
                              type === selectedSchemaType ? "bg-primary/10 text-white font-semibold" : "text-muted-foreground"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Dynamic Form */}
                <div className="glass-card rounded-2xl p-6 border-white/5">
                  {selectedSchemaType === "FAQ" ? (
                    <div>
                      <h4 className="text-xs font-bold uppercase text-accent mb-4">FAQ Items</h4>
                      <div className="space-y-4">
                        {faqItems.map((item, idx) => (
                          <div key={item.id} className="p-4 bg-neutral-900 border border-white/5 rounded-xl space-y-3 relative group">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">Question {idx + 1}</span>
                              {faqItems.length > 1 && (
                                <button
                                  onClick={() => handleRemoveFaqItem(item.id)}
                                  aria-label={`Remove question ${idx + 1}`}
                                  className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                            <div>
                              <label htmlFor={`faq-q-${item.id}`} className="block text-[10px] text-muted-foreground mb-1.5">Question</label>
                              <input
                                id={`faq-q-${item.id}`}
                                type="text"
                                value={item.question}
                                onChange={(e) => handleFaqChange(item.id, "question", e.target.value)}
                                placeholder="e.g. What is the pricing model of Acme?"
                                className={`w-full bg-neutral-950 border p-3 rounded-lg text-xs text-white focus:outline-none focus:border-primary/50 transition-colors ${
                                  schemaErrors[`${item.id}-question`] ? "border-red-500/50" : "border-white/5"
                                }`}
                              />
                              {schemaErrors[`${item.id}-question`] && (
                                <p role="alert" className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  {schemaErrors[`${item.id}-question`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <label htmlFor={`faq-a-${item.id}`} className="block text-[10px] text-muted-foreground mb-1.5">Answer</label>
                              <textarea
                                id={`faq-a-${item.id}`}
                                rows={3}
                                value={item.answer}
                                onChange={(e) => handleFaqChange(item.id, "answer", e.target.value)}
                                placeholder="Provide a clear, detailed answer..."
                                className={`w-full bg-neutral-950 border p-3 rounded-lg text-xs text-white focus:outline-none focus:border-primary/50 resize-y transition-colors ${
                                  schemaErrors[`${item.id}-answer`] ? "border-red-500/50" : "border-white/5"
                                }`}
                              />
                              {schemaErrors[`${item.id}-answer`] && (
                                <p role="alert" className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  {schemaErrors[`${item.id}-answer`]}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={handleAddFaqItem}
                          className="w-full py-3 rounded-xl border border-dashed border-white/10 text-xs font-semibold text-muted-foreground hover:text-white hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Question
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-xs font-bold uppercase text-accent mb-4">{selectedSchemaType} Details</h4>
                      <div className="space-y-4">
                        {currentFields.map((field) => (
                          <div key={field.key}>
                            <label htmlFor={`field-${field.key}`} className="block text-[10px] text-muted-foreground mb-1.5">
                              {field.label}{field.required && <span className="text-red-400 ml-0.5">*</span>}
                            </label>
                            {field.type === "textarea" ? (
                              <textarea
                                id={`field-${field.key}`}
                                rows={3}
                                value={schemaFields[field.key] || ""}
                                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className={`w-full bg-neutral-950 border p-3 rounded-lg text-xs text-white focus:outline-none focus:border-primary/50 resize-y transition-colors ${
                                  schemaErrors[field.key] ? "border-red-500/50" : "border-white/5"
                                }`}
                              />
                            ) : (
                              <input
                                id={`field-${field.key}`}
                                type={field.type}
                                value={schemaFields[field.key] || ""}
                                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className={`w-full bg-neutral-950 border p-3 rounded-lg text-xs text-white focus:outline-none focus:border-primary/50 transition-colors ${
                                  schemaErrors[field.key] ? "border-red-500/50" : "border-white/5"
                                }`}
                              />
                            )}
                            {schemaErrors[field.key] && (
                              <p role="alert" className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {schemaErrors[field.key]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerateSchema}
                    disabled={isGeneratingSchema}
                    className="w-full mt-6 py-3.5 bg-gradient-to-r from-primary to-accent text-background font-extrabold text-sm rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    {isGeneratingSchema ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Code2 className="h-4 w-4" />
                        Generate Schema
                      </>
                    )}
                  </button>
                </div>

                {/* Content Preview */}
                <div className="glass-card rounded-2xl p-6 border-white/5">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-4 flex items-center gap-2">
                    <Eye className="h-3.5 w-3.5 text-accent" />
                    Content Preview
                  </h4>
                  {selectedSchemaType === "FAQ" ? (
                    <div className="space-y-3">
                      {faqItems.filter(i => i.question.trim() || i.answer.trim()).length === 0 ? (
                        <p className="text-xs text-muted-foreground/60 text-center py-4">Enter questions and answers to see a preview.</p>
                      ) : (
                        faqItems.filter(i => i.question.trim() || i.answer.trim()).map((item, idx) => (
                          <div key={item.id} className="p-3 bg-neutral-900/60 rounded-lg border border-white/5">
                            <p className="text-xs font-semibold text-white">
                              <span className="text-accent mr-1.5">Q{idx + 1}.</span>
                              {item.question || "(No question)"}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                              {item.answer || "(No answer)"}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentFields.filter(f => schemaFields[f.key]?.trim()).length === 0 ? (
                        <p className="text-xs text-muted-foreground/60 text-center py-4">Fill in the form fields to see a preview.</p>
                      ) : (
                        currentFields.filter(f => schemaFields[f.key]?.trim()).map(f => (
                          <div key={f.key} className="flex gap-3 text-xs py-1">
                            <span className="text-muted-foreground font-medium min-w-[100px] shrink-0">{f.label}:</span>
                            <span className="text-white break-all">{schemaFields[f.key]}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* AEO Content Quality Score */}
                <div className="glass-card rounded-2xl p-6 border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <ClipboardCheck className="h-3.5 w-3.5 text-accent" />
                      AEO Content Quality
                    </h4>
                    <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Content quality estimate
                    </span>
                  </div>
                  {/* Score */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className={`text-4xl font-heading font-black ${
                      qualityResult.score >= 80 ? "text-emerald-400" : qualityResult.score >= 50 ? "text-amber-400" : "text-red-400"
                    }`}>
                      {qualityResult.score}
                    </span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mb-4">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        qualityResult.score >= 80 ? "bg-emerald-400" : qualityResult.score >= 50 ? "bg-amber-400" : "bg-red-400"
                      }`}
                      style={{ width: `${qualityResult.score}%` }}
                    />
                  </div>
                  <div className="space-y-2">
                    {qualityResult.checks.map((check, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        {check.passed ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />
                        )}
                        <div>
                          <span className={check.passed ? "text-muted-foreground" : "text-amber-300"}>{check.label}</span>
                          {check.suggestion && (
                            <p className="text-[10px] text-muted-foreground/60 mt-0.5">{check.suggestion}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Output */}
              <div className="space-y-6">
                {/* Generated Schema Output */}
                <div className="glass-card rounded-2xl p-6 border-white/5 lg:sticky lg:top-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground">Generated Schema</h4>
                    {generatedSchema && schemaValidation.every(v => v.passed) && (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Valid JSON-LD
                      </span>
                    )}
                  </div>

                  {!generatedSchema ? (
                    /* Empty State */
                    <div className="py-16 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mb-4">
                        <FileJson className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">Your generated schema will appear here.</p>
                      <p className="text-xs text-muted-foreground/60 max-w-xs">Select a schema type, enter your content, and click Generate Schema.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Schema type badge */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Schema Type</span>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-semibold">
                          {selectedSchemaType === "FAQ" ? "FAQPage" : selectedSchemaType}
                        </span>
                      </div>

                      {/* Code Block */}
                      <div className="relative">
                        <pre className="text-[11px] text-emerald-400 font-mono overflow-x-auto p-4 bg-black/50 rounded-xl whitespace-pre-wrap max-h-[400px] overflow-y-auto border border-white/5 leading-relaxed">
                          {generatedSchema}
                        </pre>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleCopySchema("json")}
                          className="py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-white hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {copiedSchema === "json" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{copiedSchema === "json" ? "Copied!" : "Copy Schema"}</span>
                        </button>
                        <button
                          onClick={() => handleCopySchema("html")}
                          className="py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-white hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {copiedSchema === "html" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Code2 className="h-3.5 w-3.5" />}
                          <span>{copiedSchema === "html" ? "Copied!" : "Copy HTML"}</span>
                        </button>
                        <button
                          onClick={handleDownloadSchema}
                          className="py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-white hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Validation Panel */}
                {generatedSchema && (
                  <div className="glass-card rounded-2xl p-6 border-white/5">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-4 flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                      Validation
                    </h4>
                    <div className="space-y-2.5">
                      {schemaValidation.map((check, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          {check.passed ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          ) : (
                            <AlertCircle className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                          )}
                          <div>
                            <span className={check.passed ? "text-muted-foreground" : "text-red-300"}>{check.label}</span>
                            {check.message && (
                              <p className="text-[10px] text-red-400/70 mt-0.5">{check.message}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Implementation Instructions */}
                {generatedSchema && (
                  <div className="glass-card rounded-2xl p-6 border-white/5">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-4 flex items-center gap-2">
                      <Info className="h-3.5 w-3.5 text-accent" />
                      How to Use
                    </h4>
                    <ol className="space-y-2 text-xs text-muted-foreground list-decimal list-inside">
                      <li>Copy the generated JSON-LD.</li>
                      <li>Add it to the relevant webpage.</li>
                      <li>Place the script inside the page <code className="text-accent bg-accent/10 px-1 py-0.5 rounded text-[10px]">&lt;head&gt;</code>.</li>
                      <li>Publish the page.</li>
                      <li>Validate the structured data using a testing tool.</li>
                    </ol>
                    <div className="mt-4 relative">
                      <pre className="text-[10px] text-cyan-300 font-mono p-3 bg-black/50 rounded-lg border border-white/5 whitespace-pre-wrap overflow-x-auto">{`<script type="application/ld+json">
${generatedSchema}
</script>`}</pre>
                      <button
                        onClick={() => handleCopySchema("html")}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-muted-foreground hover:text-white transition-colors cursor-pointer"
                        aria-label="Copy HTML script tag"
                      >
                        {copiedSchema === "html" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Saved Schemas Collection */}
            {savedSchemas.length > 0 && (
              <div className="glass-card rounded-2xl p-6 border-white/5">
                <h3 className="font-heading font-bold text-lg text-white mb-4">Saved Schemas ({savedSchemas.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedSchemas.map((s) => (
                    <div key={s.id} className="p-4 rounded-xl bg-neutral-900 border border-white/5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-bold text-white mb-0.5 truncate max-w-[200px]">{s.question}</h4>
                            <span className="text-[10px] text-accent">{s.answer}</span>
                          </div>
                          <button onClick={() => handleDeleteSchema(s.id)} className="text-muted-foreground hover:text-red-400 transition-colors cursor-pointer p-1">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-muted-foreground/50 mt-1">{s.createdAt}</p>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(s.json)}
                        className="py-1.5 px-3 bg-neutral-950 border border-white/5 text-[10px] text-accent rounded font-medium hover:bg-white/5 self-start mt-3 cursor-pointer transition-colors"
                      >
                        Copy JSON-LD
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Generator Tab */}
        {activeTab === "generator" && (
          <div className="space-y-8">
            <div className="glass-card rounded-2xl p-6 border-white/5">
              <h2 className="font-heading font-bold text-xl text-white mb-2">AI Semantic Composer</h2>
               <p className="text-xs text-muted-foreground mb-6">Build SEO-optimized blog copy and FAQs in English, Hindi & Arabic</p>
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Document Title / Primary Topic</label>
                  <input 
                    type="text" 
                    value={composerTitle}
                    onChange={(e) => setComposerTitle(e.target.value)}
                    placeholder="e.g. Best SEO Strategies for Dubai Real Estate in 2026" 
                    className="w-full bg-neutral-900 border border-white/5 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" 
                  />
                </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Language</label>
                     <select 
                       value={composerLang}
                       onChange={(e) => setComposerLang(e.target.value)}
                       className="w-full bg-neutral-900 border border-white/5 p-3 rounded-xl text-sm text-white focus:outline-none"
                     >
                       <option>English</option>
                       <option>Hindi (हिंदी)</option>
                       <option>Arabic (العربية)</option>
                     </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Tone</label>
                    <select 
                      value={composerTone}
                      onChange={(e) => setComposerTone(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/5 p-3 rounded-xl text-sm text-white focus:outline-none"
                    >
                      <option>Professional</option>
                      <option>Conversational (Highly Recommended for AEO)</option>
                      <option>Technical</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Min Words</label>
                    <input 
                      type="number" 
                      min={0}
                      value={composerMinWords}
                      onChange={(e) => setComposerMinWords(e.target.value)}
                      placeholder="e.g. 300" 
                      className="w-full bg-neutral-900 border border-white/5 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Max Words</label>
                    <input 
                      type="number" 
                      min={1}
                      value={composerMaxWords}
                      onChange={(e) => setComposerMaxWords(e.target.value)}
                      placeholder="e.g. 800" 
                      className="w-full bg-neutral-900 border border-white/5 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" 
                    />
                  </div>
                </div>
                <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-3.5 bg-gradient-to-r from-primary to-accent text-background font-extrabold text-sm rounded-xl cursor-pointer disabled:opacity-50">
                  {isGenerating ? "Generating..." : "Compose Optimised Article →"}
                </button>
                {generatedContent && (
                  <div className="mt-6 p-5 bg-neutral-950 border border-white/5 rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold uppercase text-accent">Generated Content</h4>
                      <div className="flex space-x-2">
                        <button 
                          onClick={handleSaveArticle}
                          className="px-3 py-1.5 bg-primary/20 text-primary hover:bg-primary/30 text-xs font-semibold rounded-lg flex items-center space-x-1"
                        >
                          <Bookmark className="h-3 w-3" />
                          <span>Save Article</span>
                        </button>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(generatedContent);
                          }}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg flex items-center space-x-1"
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                    {generatedContent.includes("Live generation failed") && (
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed">
                        ⚠️ This is a template, not a live AI answer. Your OpenRouter key cannot reach any model. Check the key credits and relax the Data Policy / Guardrails at openrouter.ai/settings.
                      </div>
                    )}
                    <pre className="text-xs text-white whitespace-pre-wrap font-sans leading-relaxed max-h-96 overflow-y-auto">{generatedContent}</pre>
                  </div>
                )}
              </div>
            </div>

            {/* Saved Articles List */}
            {savedArticles.length > 0 && (
              <div className="glass-card rounded-2xl p-6 border-white/5">
                <h3 className="font-heading font-bold text-lg text-white mb-4">Saved Articles ({savedArticles.length})</h3>
                <div className="space-y-4">
                  {savedArticles.map((art) => (
                    <div key={art.id} className="p-4 rounded-xl bg-neutral-900 border border-white/5 flex flex-col md:flex-row justify-between items-start gap-4">
                      {editingArticleId === art.id ? (
                        <div className="w-full space-y-3">
                          <input 
                            value={editingArticleTitle} 
                            onChange={(e) => setEditingArticleTitle(e.target.value)}
                            className="w-full bg-neutral-950 border border-white/10 p-2 rounded-lg text-sm font-bold text-white focus:outline-none focus:border-primary/50"
                          />
                          <textarea 
                            rows={6}
                            value={editingArticleContent} 
                            onChange={(e) => setEditingArticleContent(e.target.value)}
                            className="w-full bg-neutral-950 border border-white/10 p-3 rounded-lg text-xs text-white focus:outline-none focus:border-primary/50 font-sans resize-y"
                          />
                          <div className="flex space-x-2">
                            <button onClick={() => handleUpdateArticle(art.id)} className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-semibold rounded-lg flex items-center space-x-1 cursor-pointer">
                              <Save className="h-3 w-3" />
                              <span>Save Changes</span>
                            </button>
                            <button onClick={() => setEditingArticleId(null)} className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-muted-foreground text-xs font-semibold rounded-lg cursor-pointer">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-full md:w-auto flex-grow">
                            <h4 className="text-sm font-bold text-white mb-1">{art.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-3 md:line-clamp-2 max-w-2xl">{art.content}</p>
                            <span className="text-[10px] text-muted-foreground/60 mt-2 block">{art.createdAt}</span>
                          </div>
                          <div className="flex space-x-2 shrink-0">
                            <button 
                              onClick={() => {
                                setEditingArticleId(art.id);
                                setEditingArticleTitle(art.title);
                                setEditingArticleContent(art.content);
                              }}
                              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg cursor-pointer transition-colors"
                              title="Edit Article"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(art.content);
                                setCopiedArticleId(art.id);
                                setTimeout(() => setCopiedArticleId(null), 2000);
                              }}
                              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg cursor-pointer transition-colors"
                              title="Copy to Clipboard"
                            >
                              {copiedArticleId === art.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                            <button 
                              onClick={() => handleDeleteArticle(art.id)}
                              className="p-2 bg-neutral-800 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 rounded-lg cursor-pointer transition-colors"
                              title="Delete Article"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Keywords Tab */}
        {activeTab === "keywords" && (
          <div className="glass-card rounded-2xl p-6 border-white/5">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-heading font-bold text-xl text-white">Keyword Research Workspace</h2>
                <p className="text-xs text-muted-foreground mt-1">Live metrics, volume, difficulty, and AI citation rates</p>
              </div>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={keywordQuery}
                  onChange={(e) => setKeywordQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchKeywords()}
                  placeholder="Enter topic or niche..."
                  className="bg-neutral-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                />
                <button 
                  onClick={handleSearchKeywords}
                  disabled={isSearchingKeywords}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-background text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isSearchingKeywords ? "Searching..." : "Research"}</span>
                </button>
              </div>
            </div>

            {/* Keyword Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-muted-foreground uppercase tracking-wider font-semibold">
                    <th className="pb-3 pr-4">Keyword Topic</th>
                    <th className="pb-3 px-4">Search Volume</th>
                    <th className="pb-3 px-4">Difficulty (KD)</th>
                    <th className="pb-3 px-4">Est. CPC</th>
                    <th className="pb-3 px-4">AI citation rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white">
                  {keywordsList.map((kw, idx) => (
                    <tr key={idx} className="hover:bg-white/2">
                      <td className="py-3.5 pr-4 font-semibold">{kw.word}</td>
                      <td className="py-3.5 px-4 text-muted-foreground">{kw.vol}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${parseInt(kw.diff) > 50 ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                          {kw.diff}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{kw.cpc || "$3.20"}</td>
                      <td className="py-3.5 px-4 text-accent font-semibold">{kw.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Competitors Tab */}
        {activeTab === "competitors" && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 border-white/5">
              <h2 className="font-heading font-bold text-xl text-white mb-2">Competitor Analysis</h2>
              <p className="text-xs text-muted-foreground mb-6">Compare keyword gap parameters and authority metrics against any rival domain</p>
              
              <div className="flex max-w-xl space-x-3 mb-4">
                <input 
                  type="text" 
                  value={competitorInput}
                  onChange={(e) => setCompetitorInput(e.target.value)}
                  placeholder="e.g. competitor-brand.com"
                  className="bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 text-xs text-white flex-grow focus:outline-none"
                />
                <button 
                  onClick={handleScanCompetitor}
                  disabled={isScanningCompetitor}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-background font-bold text-xs rounded-xl cursor-pointer disabled:opacity-50 flex items-center space-x-2"
                >
                  <RefreshCw className={`h-3 w-3 ${isScanningCompetitor ? "animate-spin" : ""}`} />
                  <span>{isScanningCompetitor ? "Analyzing..." : "Compare Domain"}</span>
                </button>
              </div>

              {competitorError && (
                <p className="text-xs text-red-400 mt-2">{competitorError}</p>
              )}
            </div>

            {competitorData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Your Domain Card */}
                <div className="glass-card rounded-2xl p-6 border-white/5 bg-neutral-950/80">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase text-accent">Your Project</span>
                    <span className="text-xs text-muted-foreground">{domainUrl}</span>
                  </div>
                  <div className="mb-4">
                    <GlobalLocationSelector />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-neutral-900 rounded-xl">
                      <p className="text-[10px] text-muted-foreground uppercase">SEO Score</p>
                      <p className="text-3xl font-heading font-black text-white mt-1">{seoScore}</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl">
                      <p className="text-[10px] text-muted-foreground uppercase">AEO AI Index</p>
                      <p className="text-3xl font-heading font-black text-accent mt-1">{aeoScore}</p>
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3">Audit Issues ({auditIssues.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {auditIssues.map((issue) => (
                      <div key={issue.id} className="p-2.5 rounded bg-neutral-900 text-xs text-white flex justify-between">
                        <span>{issue.title}</span>
                        <span className="text-[10px] text-amber-400">{issue.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitor Domain Card */}
                <div className="glass-card rounded-2xl p-6 border-white/5 bg-neutral-950/80">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase text-red-400">Competitor</span>
                    <span className="text-xs text-muted-foreground">{competitorData.domainUrl}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-neutral-900 rounded-xl">
                      <p className="text-[10px] text-muted-foreground uppercase">SEO Score</p>
                      <p className="text-3xl font-heading font-black text-white mt-1">{competitorData.seoScore}</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl">
                      <p className="text-[10px] text-muted-foreground uppercase">AEO AI Index</p>
                      <p className="text-3xl font-heading font-black text-accent mt-1">{competitorData.aeoScore}</p>
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3">Audit Issues ({competitorData.auditIssues.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {competitorData.auditIssues.map((issue) => (
                      <div key={issue.id} className="p-2.5 rounded bg-neutral-900 text-xs text-white flex justify-between">
                        <span>{issue.title}</span>
                        <span className="text-[10px] text-amber-400">{issue.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Monetization Tab */}
      {activeTab === "monetization" && (
        <main className="flex-grow p-4 md:p-8 overflow-y-auto max-h-screen no-scrollbar">
          <header className="mb-6 md:mb-8 pb-6 border-b border-white/5">
            <h1 className="font-heading font-bold text-2xl text-white">Monetization & Ad Management</h1>
            <p className="text-xs text-muted-foreground mt-1">Configure advertising platforms, placements, and consent</p>
          </header>

          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: "Est. Revenue", value: "$0.00", sub: "Analytics connection required", icon: DollarSign },
                { label: "Impressions", value: "0", sub: "Analytics connection required", icon: Eye },
                { label: "Clicks", value: "0", sub: "Analytics connection required", icon: MousePointer },
                { label: "CTR", value: "0%", sub: "Analytics connection required", icon: TrendingUp },
                { label: "Active Placements", value: String(ads.filter((a: Record<string, unknown>) => a.status === "active").length), sub: `${ads.length} total ads`, icon: BadgeDollarSign },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="glass-card rounded-2xl p-4 border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{card.label}</p>
                      <Icon className="h-4 w-4 text-accent" />
                    </div>
                    <p className="text-2xl font-heading font-black text-white">{card.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{card.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* Sub-tabs */}
            <div className="flex overflow-x-auto space-x-2 border-b border-white/5 pb-2">
              {["overview", "adsense", "meta", "instagram", "placements", "analytics", "consent"].map((tab) => (
                <button key={tab} onClick={() => setMonetizationTab(tab)} className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize whitespace-nowrap ${monetizationTab === tab ? "bg-primary/10 text-white border border-primary/20" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}>
                  {tab === "adsense" ? "Google AdSense" : tab === "meta" ? "Meta / Facebook" : tab}
                </button>
              ))}
            </div>

            {/* Overview Sub-tab */}
            {monetizationTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card rounded-2xl p-6 border-white/5">
                  <h3 className="font-heading font-bold text-lg text-white mb-4">Platform Status</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Google AdSense", enabled: (monetizationSettings.adsenseEnabled as boolean) || false, id: monetizationSettings.adsensePublisherId as string || "" },
                      { name: "Meta / Facebook", enabled: (monetizationSettings.metaEnabled as boolean) || false, id: monetizationSettings.metaPixelId as string || "" },
                      { name: "Instagram", enabled: (monetizationSettings.instagramEnabled as boolean) || false, id: monetizationSettings.instagramBusinessAccountId as string || "" },
                      { name: "Custom Ads", enabled: (monetizationSettings.customAdsEnabled as boolean) || false, id: `${ads.length} ads` },
                    ].map((platform) => (
                      <div key={platform.name} className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-white/5">
                        <div>
                          <p className="text-xs font-semibold text-white">{platform.name}</p>
                          <p className="text-[10px] text-muted-foreground">{platform.id || "Not configured"}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${platform.enabled ? "bg-emerald-500/10 text-emerald-400" : "bg-neutral-800 text-neutral-400"}`}>
                          {platform.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-card rounded-2xl p-6 border-white/5">
                  <h3 className="font-heading font-bold text-lg text-white mb-4">Placements</h3>
                  <p className="text-xs text-muted-foreground mb-4">Active ad placements across your site</p>
                  <div className="grid grid-cols-2 gap-3">
                    {["header", "hero_bottom", "content_top", "content_middle", "content_bottom", "sidebar", "footer", "mobile_sticky", "desktop_sticky"].map((placement) => {
                      const count = ads.filter((a: Record<string, unknown>) => a.placement === placement && a.status === "active").length;
                      return (
                        <div key={placement} className="p-3 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-between">
                          <span className="text-xs text-white capitalize">{placement.replace("_", " ")}</span>
                          <span className="text-[10px] text-muted-foreground">{count} ad{count !== 1 ? "s" : ""}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* AdSense Sub-tab */}
            {monetizationTab === "adsense" && (
              <div className="glass-card rounded-2xl p-6 border-white/5 space-y-6">
                <h3 className="font-heading font-bold text-lg text-white">Google AdSense</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">Enable Google AdSense</span>
                      <button onClick={() => saveSetting("adsenseEnabled", !(monetizationSettings.adsenseEnabled as boolean))} className={`p-2 rounded-lg ${(monetizationSettings.adsenseEnabled as boolean) ? "bg-primary/20 text-primary" : "bg-neutral-800 text-neutral-400"}`}>
                        {(monetizationSettings.adsenseEnabled as boolean) ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Publisher ID</label>
                      <input type="text" value={(monetizationSettings.adsensePublisherId as string) || ""} onChange={(e) => saveSetting("adsensePublisherId", e.target.value)} placeholder="ca-pub-XXXXXXXXXXXXXXXX" className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none" />
                      <p className="text-[10px] text-muted-foreground mt-1">Format: ca-pub-XXXXXXXXXX</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Client ID</label>
                      <input type="text" value={(monetizationSettings.adsenseClientId as string) || ""} onChange={(e) => saveSetting("adsenseClientId", e.target.value)} placeholder="ca-pub-XXXXXXXXXXXXXXXX" className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">Auto Ads</span>
                      <button onClick={() => saveSetting("adsenseAutoAds", !(monetizationSettings.adsenseAutoAds as boolean))} className={`p-2 rounded-lg ${(monetizationSettings.adsenseAutoAds as boolean) ? "bg-primary/20 text-primary" : "bg-neutral-800 text-neutral-400"}`}>
                        {(monetizationSettings.adsenseAutoAds as boolean) ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">Responsive Ads</span>
                      <button onClick={() => saveSetting("adsenseResponsive", !(monetizationSettings.adsenseResponsive as boolean))} className={`p-2 rounded-lg ${(monetizationSettings.adsenseResponsive as boolean) ? "bg-primary/20 text-primary" : "bg-neutral-800 text-neutral-400"}`}>
                        {(monetizationSettings.adsenseResponsive as boolean) ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">AdSense Script / Configuration</label>
                    <textarea value={(monetizationSettings.adsenseScript as string) || ""} onChange={(e) => saveSetting("adsenseScript", e.target.value)} rows={8} placeholder="Paste AdSense script or configuration here..." className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none font-mono" />
                    <p className="text-[10px] text-muted-foreground mt-1">Script is stored separately and loaded only when enabled.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Meta Sub-tab */}
            {monetizationTab === "meta" && (
              <div className="glass-card rounded-2xl p-6 border-white/5 space-y-6">
                <h3 className="font-heading font-bold text-lg text-white">Meta / Facebook</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">Enable Meta Integration</span>
                      <button onClick={() => saveSetting("metaEnabled", !(monetizationSettings.metaEnabled as boolean))} className={`p-2 rounded-lg ${(monetizationSettings.metaEnabled as boolean) ? "bg-primary/20 text-primary" : "bg-neutral-800 text-neutral-400"}`}>
                        {(monetizationSettings.metaEnabled as boolean) ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Meta Pixel ID</label>
                      <input type="text" value={(monetizationSettings.metaPixelId as string) || ""} onChange={(e) => saveSetting("metaPixelId", e.target.value)} placeholder="1234567890" className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Meta App ID</label>
                      <input type="text" value={(monetizationSettings.metaAppId as string) || ""} onChange={(e) => saveSetting("metaAppId", e.target.value)} placeholder="Meta App ID" className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Environment</label>
                      <select value={(monetizationSettings.metaEnvironment as string) || "production"} onChange={(e) => saveSetting("metaEnvironment", e.target.value)} className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none">
                        <option value="development">Development</option>
                        <option value="production">Production</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Test Event Code</label>
                      <input type="text" value={(monetizationSettings.metaTestEventCode as string) || ""} onChange={(e) => saveSetting("metaTestEventCode", e.target.value)} placeholder="TEST12345" className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Events API Token (Server-side only)</label>
                    <input type="password" value={(monetizationSettings.metaEventsApiToken as string) || ""} onChange={(e) => saveSetting("metaEventsApiToken", e.target.value)} placeholder="••••••••••••••••" className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none mb-4" />
                    <p className="text-[10px] text-amber-400 mb-4">Never expose this token in client-side code. It is stored securely and used only for server-side Events API calls.</p>
                    <h4 className="text-xs font-bold text-white mb-2">Supported Events</h4>
                    <div className="flex flex-wrap gap-2">
                      {["PageView", "ViewContent", "Search", "Lead", "CompleteRegistration", "Purchase"].map((event) => (
                        <span key={event} className="px-2 py-1 rounded-lg bg-neutral-800 text-[10px] text-muted-foreground border border-white/5">{event}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Instagram Sub-tab */}
            {monetizationTab === "instagram" && (
              <div className="glass-card rounded-2xl p-6 border-white/5 space-y-6">
                <h3 className="font-heading font-bold text-lg text-white">Instagram / Meta Business</h3>
                <p className="text-xs text-amber-400">Instagram advertising is managed through the Meta ecosystem. Entering an Instagram username does not automatically generate revenue.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">Enable Instagram Integration</span>
                      <button onClick={() => saveSetting("instagramEnabled", !(monetizationSettings.instagramEnabled as boolean))} className={`p-2 rounded-lg ${(monetizationSettings.instagramEnabled as boolean) ? "bg-primary/20 text-primary" : "bg-neutral-800 text-neutral-400"}`}>
                        {(monetizationSettings.instagramEnabled as boolean) ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Instagram Business Account ID</label>
                      <input type="text" value={(monetizationSettings.instagramBusinessAccountId as string) || ""} onChange={(e) => saveSetting("instagramBusinessAccountId", e.target.value)} placeholder="Instagram Business Account ID" className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Meta Business Account ID</label>
                      <input type="text" value={(monetizationSettings.metaBusinessAccountId as string) || ""} onChange={(e) => saveSetting("metaBusinessAccountId", e.target.value)} placeholder="Meta Business Account ID" className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Instagram Profile Reference</label>
                      <input type="text" value={(monetizationSettings.instagramProfile as string) || ""} onChange={(e) => saveSetting("instagramProfile", e.target.value)} placeholder="@yourbrand" className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none" />
                    </div>
                  </div>
                  <div className="glass-card rounded-2xl p-6 border-white/5 bg-neutral-950/80">
                    <h4 className="text-xs font-bold text-white mb-2">How it works</h4>
                    <ul className="space-y-2 text-xs text-muted-foreground list-disc list-inside">
                      <li>Instagram advertising is managed through the Meta ecosystem.</li>
                      <li>Connect your Instagram Business Account and Meta Business Account.</li>
                      <li>Use Meta Pixel for campaign tracking and attribution.</li>
                      <li>Promotional links and embeds can be configured in Ad Placements.</li>
                      <li>Actual Meta Ads API integration requires OAuth/API credentials — structure is ready for future connection.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Placements Sub-tab */}
            {monetizationTab === "placements" && (
              <div className="glass-card rounded-2xl p-6 border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-lg text-white">Ad Placements</h3>
                  <button onClick={() => setAdForm({ name: "", platform: "custom", placement: "content_top", device: "all", status: "active", priority: 1, startDate: "", endDate: "", configuration: {} })} className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-background font-bold text-xs rounded-xl flex items-center space-x-2">
                    <PlusCircle className="h-3 w-3" /><span>Create Advertisement</span>
                  </button>
                </div>
                {Object.keys(adForm).length > 0 && (
                  <div className="p-4 rounded-xl bg-neutral-900 border border-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-white">New Advertisement</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input value={(adForm.name as string) || ""} onChange={(e) => setAdForm({ ...adForm, name: e.target.value })} placeholder="Advertisement Name" className="bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                      <select value={(adForm.platform as string) || "custom"} onChange={(e) => setAdForm({ ...adForm, platform: e.target.value })} className="bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                        <option value="adsense">Google AdSense</option>
                        <option value="meta">Meta</option>
                        <option value="instagram">Instagram</option>
                        <option value="custom">Custom</option>
                      </select>
                      <select value={(adForm.placement as string) || "content_top"} onChange={(e) => setAdForm({ ...adForm, placement: e.target.value })} className="bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                        {["header", "hero_bottom", "content_top", "content_middle", "content_bottom", "sidebar", "footer", "mobile_sticky", "desktop_sticky"].map((p) => <option key={p} value={p}>{p.replace("_", " ")}</option>)}
                      </select>
                      <select value={(adForm.device as string) || "all"} onChange={(e) => setAdForm({ ...adForm, device: e.target.value })} className="bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                        <option value="all">All Devices</option>
                        <option value="desktop">Desktop</option>
                        <option value="mobile">Mobile</option>
                      </select>
                      <input value={(adForm.startDate as string) || ""} onChange={(e) => setAdForm({ ...adForm, startDate: e.target.value })} type="date" className="bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                      <input value={(adForm.endDate as string) || ""} onChange={(e) => setAdForm({ ...adForm, endDate: e.target.value })} type="date" className="bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={handleSaveAd} className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-background font-bold text-xs rounded-xl">Save</button>
                      <button onClick={() => setAdForm({})} className="px-4 py-2 bg-neutral-800 text-white font-bold text-xs rounded-xl">Cancel</button>
                    </div>
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead><tr className="border-b border-white/5 text-muted-foreground"><th className="py-2 px-3">Name</th><th className="py-2 px-3">Platform</th><th className="py-2 px-3">Placement</th><th className="py-2 px-3">Device</th><th className="py-2 px-3">Status</th><th className="py-2 px-3">Actions</th></tr></thead>
                    <tbody>
                      {ads.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">No advertisements yet. Create one above.</td></tr>}
                        {ads.map((ad: Record<string, unknown>, index: number) => (
                          <tr key={(ad.id as string) || `ad-${index}`} className="border-b border-white/5">
                          <td className="py-2 px-3 text-white">{(ad.name as string) || "Untitled"}</td>
                          <td className="py-2 px-3 capitalize">{(ad.platform as string) || ""}</td>
                          <td className="py-2 px-3 capitalize">{(ad.placement as string) || ""}</td>
                          <td className="py-2 px-3 capitalize">{(ad.device as string) || "all"}</td>
                          <td className="py-2 px-3"><span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${ad.status === "active" ? "bg-emerald-500/10 text-emerald-400" : ad.status === "draft" ? "bg-amber-500/10 text-amber-400" : "bg-neutral-800 text-neutral-400"}`}>{(ad.status as string) || "draft"}</span></td>
                          <td className="py-2 px-3 flex space-x-2">
                            <button onClick={() => setAdForm(ad)} className="p-1 hover:text-white text-muted-foreground"><Edit2 className="h-3 w-3" /></button>
                            <button onClick={() => deleteAd((ad.id as string) || "")} className="p-1 hover:text-red-400 text-muted-foreground"><Trash2 className="h-3 w-3" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics Sub-tab */}
            {monetizationTab === "analytics" && (
              <div className="glass-card rounded-2xl p-6 border-white/5 text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading font-bold text-lg text-white mb-2">Advertising Analytics</h3>
                <p className="text-xs text-muted-foreground">Analytics connection required. Connect AdSense or Meta to see impressions, clicks, CTR, and revenue data.</p>
              </div>
            )}

            {/* Consent Sub-tab */}
            {monetizationTab === "consent" && (
              <div className="glass-card rounded-2xl p-6 border-white/5 space-y-6">
                <h3 className="font-heading font-bold text-lg text-white">Privacy & Advertising Consent</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Require Advertising Consent</span>
                  <button onClick={() => saveSetting("consentRequired", !(monetizationSettings.consentRequired as boolean))} className={`p-2 rounded-lg ${(monetizationSettings.consentRequired as boolean) ? "bg-primary/20 text-primary" : "bg-neutral-800 text-neutral-400"}`}>
                    {(monetizationSettings.consentRequired as boolean) ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { key: "necessary", label: "Necessary", desc: "Required for basic site functionality", required: true },
                    { key: "analytics", label: "Analytics", desc: "Help us improve by understanding usage", required: false },
                    { key: "advertising", label: "Advertising", desc: "Personalized ads and tracking", required: false },
                  ].map((category) => (
                    <div key={category.key} className="flex items-center justify-between p-4 rounded-xl bg-neutral-900 border border-white/5">
                      <div>
                        <p className="text-xs font-semibold text-white">{category.label}</p>
                        <p className="text-[10px] text-muted-foreground">{category.desc}</p>
                      </div>
                      <button disabled={category.required} onClick={() => setConsentGiven({ ...consentGiven, [category.key]: !consentGiven[category.key as keyof typeof consentGiven] })} className={`p-2 rounded-lg ${consentGiven[category.key as keyof typeof consentGiven] ? "bg-primary/20 text-primary" : "bg-neutral-800 text-neutral-400"} ${category.required ? "opacity-50 cursor-not-allowed" : ""}`}>
                        {consentGiven[category.key as keyof typeof consentGiven] ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
