"use client";

import { useEffect, useState } from "react";
import { doc, getDocs, setDoc, deleteDoc, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { X, Plus } from "lucide-react";
import type { Advertisement } from "@/components/ads";

interface AdFormData {
  name: string;
  platform: "adsense" | "meta" | "instagram" | "custom";
  placement: "header" | "hero_bottom" | "content_top" | "content_middle" | "content_bottom" | "sidebar" | "footer" | "mobile_sticky" | "desktop_sticky";
  type: string;
  status: "active" | "draft" | "disabled";
  device: "all" | "desktop" | "mobile";
  priority: number;
  startDate: string;
  endDate: string;
  configuration: Record<string, string>;
}

const emptyForm: AdFormData = {
  name: "",
  platform: "adsense",
  placement: "content_top",
  type: "banner",
  status: "active",
  device: "all",
  priority: 0,
  startDate: "",
  endDate: "",
  configuration: {},
};

export default function AdPlacementsTab() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdFormData>(emptyForm);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "advertisements"), orderBy("priority", "desc"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setAds(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Advertisement)));
    } catch (e) {
      console.error("Error fetching ads:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAds();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (ad: Advertisement) => {
    setEditingId(ad.id);
    setForm({
      name: ad.name,
      platform: ad.platform,
      placement: ad.placement,
      type: ad.type,
      status: ad.status,
      device: ad.device,
      priority: ad.priority ?? 0,
      startDate: ad.startDate ? new Date(ad.startDate).toISOString().slice(0, 10) : "",
      endDate: ad.endDate ? new Date(ad.endDate).toISOString().slice(0, 10) : "",
      configuration: ad.configuration || {},
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this advertisement?")) return;
    try {
      await deleteDoc(doc(db, "advertisements", id));
      setAds((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error("Error deleting ad:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      const payload: Omit<Advertisement, "id"> = {
        ...form,
        configuration: form.configuration,
        createdAt: editingId ? (ads.find((a) => a.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (editingId) {
        await setDoc(doc(db, "advertisements", editingId), payload, { merge: true });
      } else {
        await setDoc(doc(db, "advertisements"), payload);
      }
      setShowModal(false);
      fetchAds();
    } catch (e) {
      console.error("Error saving ad:", e);
    }
  };

  const platformColors: Record<string, string> = {
    adsense: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    meta: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    instagram: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    custom: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  const statusBadge = (s: string) => {
    if (s === "active") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (s === "draft") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-red-500/10 text-red-400 border-red-500/20";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">Advertisements</h3>
          <p className="text-xs text-muted-foreground mt-1">Manage active, draft, and disabled placements.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-accent text-background text-xs font-bold rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Create Ad
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading...</div>
      ) : ads.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-muted-foreground">
          <p className="text-sm">No advertisements yet. Click &quot;Create Ad&quot; to add one.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/5 text-muted-foreground">
                <th className="py-3 px-3 font-medium">Name</th>
                <th className="py-3 px-3 font-medium">Platform</th>
                <th className="py-3 px-3 font-medium">Placement</th>
                <th className="py-3 px-3 font-medium">Device</th>
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-3 font-medium">Priority</th>
                <th className="py-3 px-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-3 px-3 text-white font-medium">{ad.name}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${platformColors[ad.platform] || "bg-neutral-800 text-neutral-300"}`}>
                      {ad.platform}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">{ad.placement}</td>
                  <td className="py-3 px-3 text-muted-foreground capitalize">{ad.device}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${statusBadge(ad.status)}`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">{ad.priority}</td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button onClick={() => openEdit(ad)} className="text-accent hover:text-white transition-colors cursor-pointer">Edit</button>
                    <button onClick={() => handleDelete(ad.id)} className="text-red-400 hover:text-red-300 transition-colors cursor-pointer">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-heading font-bold text-white">{editingId ? "Edit" : "Create"} Advertisement</h4>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-white cursor-pointer"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Platform</label>
                  <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value as AdFormData["platform"] })} className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50">
                    <option value="adsense">AdSense</option>
                    <option value="meta">Meta</option>
                    <option value="instagram">Instagram</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Placement</label>
                  <select value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value as AdFormData["placement"] })} className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50">
                    <option value="header">Header</option>
                    <option value="hero_bottom">Hero Bottom</option>
                    <option value="content_top">Content Top</option>
                    <option value="content_middle">Content Middle</option>
                    <option value="content_bottom">Content Bottom</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="footer">Footer</option>
                    <option value="mobile_sticky">Mobile Sticky</option>
                    <option value="desktop_sticky">Desktop Sticky</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Type</label>
                  <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="e.g. banner" className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as AdFormData["status"] })} className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Device</label>
                  <select value={form.device} onChange={(e) => setForm({ ...form, device: e.target.value as AdFormData["device"] })} className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50">
                    <option value="all">All</option>
                    <option value="desktop">Desktop</option>
                    <option value="mobile">Mobile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Priority</label>
                  <input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value || "0", 10) })} className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Ad Slot ID</label>
                  <input value={form.configuration.adSlotId || ""} onChange={(e) => setForm({ ...form, configuration: { ...form.configuration, adSlotId: e.target.value } })} placeholder="ca-pub-xxx" className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">End Date</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Custom HTML</label>
                <textarea rows={3} value={form.configuration.customHtml || ""} onChange={(e) => setForm({ ...form, configuration: { ...form.configuration, customHtml: e.target.value } })} placeholder="<script>...</script>" className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50 font-mono" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-primary to-accent text-background text-xs font-bold rounded-xl cursor-pointer hover:opacity-90 transition-opacity">
                {editingId ? "Update" : "Create"} Ad
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
