"use client";

import { useEffect, useState, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

export type PlanKey = "free" | "pro" | "agency";

interface PlanData {
  plan: PlanKey;
  startedAt: string;
  trialEndsAt?: string;
  source?: string;
}

const PLAN_DOC_PREFIX = "userPlans";
const DEFAULT_PLAN: PlanKey = "free";

export function useUserPlan() {
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<PlanKey>(DEFAULT_PLAN);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setPlan(DEFAULT_PLAN);
        setLoading(false);
        return;
      }
      try {
        const ref = doc(db, PLAN_DOC_PREFIX, u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as PlanData;
          setPlan((data.plan as PlanKey) || DEFAULT_PLAN);
        } else {
          // First-time user: create free plan
          const initial: PlanData = {
            plan: DEFAULT_PLAN,
            startedAt: new Date().toISOString(),
          };
          await setDoc(ref, initial);
          setPlan(DEFAULT_PLAN);
        }
      } catch (e) {
        console.error("Failed to load user plan:", e);
        setPlan(DEFAULT_PLAN);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const setUserPlan = useCallback(
    async (newPlan: PlanKey, source?: string) => {
      if (!user) return;
      setUpgrading(true);
      try {
        const ref = doc(db, PLAN_DOC_PREFIX, user.uid);
        const data: PlanData = {
          plan: newPlan,
          startedAt: new Date().toISOString(),
          source: source || "manual",
        };
        if (newPlan !== "free" && source === "trial") {
          const trialEnd = new Date();
          trialEnd.setDate(trialEnd.getDate() + 14);
          data.trialEndsAt = trialEnd.toISOString();
        }
        await setDoc(ref, data, { merge: true });
        setPlan(newPlan);
      } catch (e) {
        console.error("Failed to update plan:", e);
      } finally {
        setUpgrading(false);
      }
    },
    [user]
  );

  return {
    user,
    plan,
    isFree: plan === "free",
    isPro: plan === "pro",
    isAgency: plan === "agency",
    isPaid: plan !== "free",
    loading,
    upgrading,
    setUserPlan,
  };
}

export function shouldShowAds(plan: PlanKey | string | undefined | null): boolean {
  return !plan || plan === "free";
}
