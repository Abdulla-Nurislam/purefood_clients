import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { products, mockSellers } from './src/app/data/mock-data';

// Загружаем .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Ошибка: Переменные окружения не найдены в .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('🚀 Начинаем загрузку данных в Supabase...');

  // 1. Загружаем продавцов
  console.log('📦 Загружаем продавцов...');
  const { data: sellerData, error: sellerError } = await supabase
    .from('sellers')
    .upsert(mockSellers.map(s => ({
      company_name: s.name,
      description: s.description,
      rating: s.rating,
      review_count: s.reviewCount,
      product_count: s.productCount,
      verified: s.verified,
      categories: s.categories,
      location: s.location,
      image_url: s.image,
      badges: s.badges,
      since: s.since
    })))
    .select();

  if (sellerError) {
    console.error('❌ Ошибка при загрузке продавцов:', sellerError);
    return;
  }
  console.log('✅ Продавцы загружены!');

  // 2. Загружаем товары
  console.log('📦 Загружаем товары...');
  const productsToUpload = products.map(p => ({
    name: p.name,
    price: p.price,
    old_price: p.oldPrice,
    image_url: p.image,
    category_id: p.category,
    seller_id: sellerData[0].id, // Привязываем к первому загруженному для теста
    rating: p.rating,
    review_count: p.reviewCount,
    tags: p.tags,
    allergens: p.allergens,
    origin: p.origin,
    description: p.description,
    composition: p.composition,
    weight: p.weight,
    badges: p.badges
  }));

  const { error: prodError } = await supabase
    .from('products')
    .insert(productsToUpload);

  if (prodError) {
    console.error('❌ Ошибка при загрузке товаров:', prodError);
  } else {
    console.log('✅ Товары загружены!');
  }

  console.log('✨ Готово! Твоя база Supabase теперь полна жизни.');
}

seed();
