import { useEffect, useState, useCallback } from "react";
import { db, auth } from "../lib/store";

export function useProducts() {
  const [products, setProducts] = useState(db.getProducts());
  useEffect(() => {
    const onChange = () => setProducts(db.getProducts());
    window.addEventListener("rc-store-change", onChange);
    return () => window.removeEventListener("rc-store-change", onChange);
  }, []);
  return products;
}

export function useAnnouncements() {
  const [items, setItems] = useState(db.getAnnouncements());
  useEffect(() => {
    const onChange = () => setItems(db.getAnnouncements());
    window.addEventListener("rc-store-change", onChange);
    return () => window.removeEventListener("rc-store-change", onChange);
  }, []);
  return items;
}

export function useSettings() {
  const [settings, setSettings] = useState(db.getSettings());
  useEffect(() => {
    const onChange = () => setSettings(db.getSettings());
    window.addEventListener("rc-store-change", onChange);
    return () => window.removeEventListener("rc-store-change", onChange);
  }, []);
  return settings;
}

export function useSession() {
  const [session, setSession] = useState(auth.getSession());
  useEffect(() => {
    const onChange = () => setSession(auth.getSession());
    window.addEventListener("rc-store-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("rc-store-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return session;
}

export function useForceUpdate() {
  const [, setTick] = useState(0);
  return useCallback(() => setTick((t) => t + 1), []);
}
