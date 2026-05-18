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

// ---- Orders ----

export async function fetchClientOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching client orders:', error);
    return [];
  }

  return (data || []).map(o => {
    const items: CartItem[] = (o.order_items || []).map((oi: any) => ({
      product: oi.products ? mapProduct({ ...oi.products, sellers: null, certificates: [], lab_tests: [] }) : {
        id: oi.product_id,
        name: 'Товар',
        price: Number(oi.price_at_order),
        image: '',
        category: '',
        supplier: '',
        supplierId: '',
        supplierVerified: false,
        supplierRating: 0,
        rating: 0,
        reviewCount: 0,
        tags: [],
        allergens: [],
        origin: '',
        certificates: [],
        labTests: [],
        description: '',
        composition: [],
        weight: '',
        badges: [],
      },
      quantity: oi.quantity,
    }));

    const statusMap: Record<string, Order['status']> = {
      'new': 'processing',
      'processing': 'processing',
      'shipped': 'shipped',
      'delivered': 'delivered',
      'cancelled': 'cancelled',
    };

    return {
      id: o.id,
      items,
      status: statusMap[o.status] || 'processing',
      date: new Date(o.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      total: Number(o.total),
      deliveryType: 'Стандартная',
      paymentMethod: o.payment_method || '',
      trackingSteps: buildTrackingSteps(o.status, o.created_at),
    };
  });
}

function buildTrackingSteps(status: string, createdAt: string) {
  const time = new Date(createdAt);
  const fmt = `${time.getDate()} ${time.toLocaleString('ru-RU', { month: 'short' })}, ${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`;
  const steps = [
    { label: 'Заказ принят', done: true, time: fmt },
    { label: 'Собран на складе', done: ['processing', 'shipped', 'delivered'].includes(status) },
    { label: 'Передан курьеру', done: ['shipped', 'delivered'].includes(status) },
    { label: 'В пути к вам', done: ['shipped', 'delivered'].includes(status) },
    { label: 'Доставлен', done: status === 'delivered' },
  ];
  if (status === 'cancelled') {
    return [
      { label: 'Заказ принят', done: true, time: fmt },
      { label: 'Отменён', done: true },
    ];
  }
  return steps;
}

export async function createOrder(
  cartItems: { product: Product; quantity: number }[],
  total: number,
  deliveryAddress: string,
  paymentMethod: string,
  userId?: string
) {
  if (cartItems.length === 0) return null;

  // We group by seller. In a real app, you might create multiple orders if items are from different sellers.
  // For simplicity, we create one order per seller
  const itemsBySeller = cartItems.reduce((acc, item) => {
    const sellerId = item.product.supplierId;
    if (!acc[sellerId]) acc[sellerId] = [];
    acc[sellerId].push(item);
    return acc;
  }, {} as Record<string, typeof cartItems>);

  const orders = [];

  for (const [sellerId, items] of Object.entries(itemsBySeller)) {
    const orderId = `PF-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*1000)}`;
    const sellerTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        seller_id: sellerId,
        user_id: userId || null,
        status: 'new',
        total: sellerTotal,
        delivery_address: deliveryAddress,
        payment_method: paymentMethod,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      continue;
    }

    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.product.id,
      quantity: item.quantity,
      price_at_order: item.product.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    
    if (itemsError) {
      console.error('Error creating order items:', itemsError);
    } else {
      orders.push(order);
      // Create activity for the seller's feed
      await createActivityForOrder(sellerId, orderId);
    }
  }

  return orders;
}

async function createActivityForOrder(sellerId: string, orderId: string) {
  try {
    await supabase
      .from('activities')
      .insert({
        seller_id: sellerId,
        title: `Новый заказ #${orderId}`,
        type: 'order',
      });
  } catch (err) {
    console.error('Error creating activity:', err);
  }
}

// ---- Auth (Clients) ----

export async function getClientByPhone(phone: string) {
  const fakeEmail = `${phone.replace(/\\D/g, '')}@purefood.kz`;
  const defaultPassword = "PureFoodPassword123!";

  // 1. Try to sign in to Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: fakeEmail,
    password: defaultPassword,
  });

  if (authError || !authData.user) {
    return null;
  }

  // 2. Fetch custom profile from 'users' table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (userError && userError.code !== 'PGRST116') {
    console.error('Error fetching user profile:', userError);
  }

  return userData || { id: authData.user.id, phone };
}

export async function registerClient(user: {
  phone: string;
  name?: string;
  city?: string;
}) {
  const fakeEmail = `${user.phone.replace(/\\D/g, '')}@purefood.kz`;
  const defaultPassword = "PureFoodPassword123!";

  // 1. Sign up to Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: fakeEmail,
    password: defaultPassword,
  });

  if (authError) {
    console.error('Error registering auth user:', authError);
    return null;
  }

  const userId = authData.user?.id;
  if (!userId) return null;

  // 2. We use RLS-bypassing or assume RLS allows insert if auth.uid() == id
  // BUT to be safe, if we get RLS error, we just return the auth user ID
  // since the user is successfully created in Supabase Auth!
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({
      id: userId,
      phone: user.phone,
      name: user.name,
      city: user.city
    })
    .select()
    .single();

  if (userError) {
    console.warn('Could not create profile in users table (probably RLS), but Auth succeeded:', userError);
    return { id: userId, phone: user.phone, name: user.name, city: user.city };
  }

  return userData;
}
