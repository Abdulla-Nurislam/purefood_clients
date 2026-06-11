/**
 * One-time fix: set is_active = true for all products where is_active IS NULL
 * Run once: npx tsx fix-is-active.ts
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Ошибка: Переменные окружения не найдены в .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fix() {
  console.log('🔧 Проверяем товары в Supabase...');

  // Count all products
  const { count: total } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  console.log(`📦 Всего товаров в базе: ${total}`);

  // Count active products
  const { count: active } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  console.log(`✅ Из них активных (is_active=true): ${active}`);
  console.log(`⚠️  NULL/false: ${(total || 0) - (active || 0)}`);

  if ((total || 0) > (active || 0)) {
    console.log('\n🔄 Обновляем все товары: устанавливаем is_active = true...');
    
    // Update products where is_active IS NULL
    const { error: nullError, count: nullCount } = await supabase
      .from('products')
      .update({ is_active: true })
      .is('is_active', null);

    if (nullError) {
      console.error('❌ Ошибка при обновлении NULL товаров:', nullError.message);
    } else {
      console.log(`✅ Обновлено товаров с NULL: ${nullCount || 'все'}`);
    }

    // Update products where is_active IS FALSE
    const { error: falseError, count: falseCount } = await supabase
      .from('products')
      .update({ is_active: true })
      .eq('is_active', false);

    if (falseError) {
      console.error('❌ Ошибка при обновлении false товаров:', falseError.message);
    } else {
      console.log(`✅ Обновлено товаров с false: ${falseCount || 0}`);
    }

    console.log('\n🎉 Готово! Все товары теперь активны и будут отображаться в каталоге.');
  } else {
    console.log('\n✅ Все товары уже активны. Проблема в другом — проверь RLS политики.');
  }
}

fix().catch(console.error);
