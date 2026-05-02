import { supabase } from './supabase';
import type { Product, Seller, Certificate, LabTest } from '../app/data/mock-data';

// ============================================================
// Маппинг данных из Supabase в формат, ожидаемый компонентами
// ============================================================

interface DbProduct {
  id: string;
  name: string;
  price: number;
  old_price: number | null;
  image_url: string;
  category_id: string;
  seller_id: string;
  rating: number;
  review_count: number;
  tags: string[];
  allergens: string[];
  origin: string;
  description: string;
  composition: string[];
  weight: string;
  badges: string[];
  sellers?: DbSeller;
  certificates?: DbCertificate[];
  lab_tests?: DbLabTest[];
}

interface DbSeller {
  id: string;
  company_name: string;
  description: string;
  rating: number;
  review_count: number;
  product_count: number;
  verified: boolean;
  categories: string[];
  location: string;
  image_url: string;
  badges: string[];
  since: string;
}

interface DbCertificate {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  is_valid: boolean;
}

interface DbLabTest {
  id: string;
  name: string;
  lab: string;
  test_date: string;
  result: string;
  passed: boolean;
}

function mapProduct(p: DbProduct): Product {
  const seller = p.sellers;
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    oldPrice: p.old_price ?? undefined,
    image: p.image_url,
    category: p.category_id,
    supplier: seller?.company_name ?? 'Неизвестный',
    supplierId: p.seller_id,
    supplierVerified: seller?.verified ?? false,
    supplierRating: seller?.rating ?? 0,
    rating: p.rating,
    reviewCount: p.review_count,
    tags: p.tags || [],
    allergens: p.allergens || [],
    origin: p.origin,
    certificates: (p.certificates || []).map(c => ({
      name: c.name,
      issuer: c.issuer,
      date: c.issue_date,
      valid: c.is_valid,
    })),
    labTests: (p.lab_tests || []).map(t => ({
      name: t.name,
      lab: t.lab,
      date: t.test_date,
      result: t.result,
      passed: t.passed,
    })),
    description: p.description,
    composition: p.composition || [],
    weight: p.weight,
    badges: p.badges || [],
  };
}

function mapSeller(s: DbSeller): Seller {
  return {
    id: s.id,
    name: s.company_name,
    description: s.description,
    rating: s.rating,
    reviewCount: s.review_count,
    productCount: s.product_count,
    verified: s.verified,
    categories: s.categories || [],
    location: s.location,
    image: s.image_url,
    badges: s.badges || [],
    since: s.since,
  };
}

// ============================================================
// API functions
// ============================================================

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      sellers (*),
      certificates (*),
      lab_tests (*)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return (data || []).map(mapProduct);
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      sellers (*),
      certificates (*),
      lab_tests (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data ? mapProduct(data) : null;
}

export async function fetchSellers(): Promise<Seller[]> {
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching sellers:', error);
    return [];
  }

  return (data || []).map(mapSeller);
}

export async function fetchSellerById(id: string): Promise<Seller | null> {
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching seller:', error);
    return null;
  }

  return data ? mapSeller(data) : null;
}

export async function fetchProductsBySeller(sellerId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      sellers (*),
      certificates (*),
      lab_tests (*)
    `)
    .eq('seller_id', sellerId)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching seller products:', error);
    return [];
  }

  return (data || []).map(mapProduct);
}
