import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// Fetch real news articles from Supabase
export function useNewsArticles(limit = 20) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from("news_articles")
        .select("id, title, source_name, source_url, published_at, description, category, company_id")
        .order("published_at", { ascending: false })
        .limit(limit);

      if (!error && data) setArticles(data);
      setLoading(false);
    }
    fetch();
  }, [limit]);

  return { articles, loading };
}

// Fetch companies from Supabase (the real ones with domains)
export function useCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name, slug, cat, hq, founded, employees, website, domain, instagram, tiktok")
        .eq("status", "active")
        .not("domain", "is", null)
        .order("name");

      if (!error && data) setCompanies(data);
      setLoading(false);
    }
    fetch();
  }, []);

  return { companies, loading };
}

// Fetch news for a specific company
export function useCompanyNews(companyId, limit = 10) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) { setLoading(false); return; }
    async function fetch() {
      const { data, error } = await supabase
        .from("news_articles")
        .select("id, title, source_name, source_url, published_at, description, category")
        .eq("company_id", companyId)
        .order("published_at", { ascending: false })
        .limit(limit);

      if (!error && data) setArticles(data);
      setLoading(false);
    }
    fetch();
  }, [companyId, limit]);

  return { articles, loading };
}

// Fetch social snapshots for a company
export function useSocialSnapshots(companyId) {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) { setLoading(false); return; }
    async function fetch() {
      const { data, error } = await supabase
        .from("social_snapshots")
        .select("*")
        .eq("company_id", companyId)
        .order("snapshot_date", { ascending: false })
        .limit(10);

      if (!error && data) setSnapshots(data);
      setLoading(false);
    }
    fetch();
  }, [companyId]);

  return { snapshots, loading };
}

// Fetch review snapshots for a company
export function useReviewSnapshots(companyId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) { setLoading(false); return; }
    async function fetch() {
      const { data, error } = await supabase
        .from("review_snapshots")
        .select("*")
        .eq("company_id", companyId)
        .order("snapshot_date", { ascending: false })
        .limit(5);

      if (!error && data) setReviews(data);
      setLoading(false);
    }
    fetch();
  }, [companyId]);

  return { reviews, loading };
}

// Fetch ad snapshots for a company
export function useAdSnapshots(companyId) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) { setLoading(false); return; }
    async function fetch() {
      const { data, error } = await supabase
        .from("ad_snapshots")
        .select("*")
        .eq("company_id", companyId)
        .order("snapshot_date", { ascending: false })
        .limit(5);

      if (!error && data) setAds(data);
      setLoading(false);
    }
    fetch();
  }, [companyId]);

  return { ads, loading };
}
