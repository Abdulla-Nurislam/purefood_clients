export interface Product {
  id: string;
  name: string;
  nameKz?: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  supplier: string;
  supplierId: string;
  supplierVerified: boolean;
  supplierRating: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  allergens: string[];
  origin: string;
  certificates: Certificate[];
  labTests: LabTest[];
  description: string;
  composition: string[];
  weight: string;
  badges: string[];
}

export interface Certificate {
  name: string;
  issuer: string;
  date: string;
  valid: boolean;
}

export interface LabTest {
  name: string;
  lab: string;
  date: string;
  result: string;
  passed: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled' | 'failed';
  date: string;
  total: number;
  deliveryType: string;
  paymentMethod: string;
  trackingSteps: { label: string; done: boolean; time?: string }[];
  rated?: boolean;
  rating?: number;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  rating: number;
  text: string;
  date: string;
  hasPhoto: boolean;
}

export interface Subscription {
  id: string;
  productId: string;
  productName: string;
  frequency: string;
  nextDelivery: string;
  active: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'promo' | 'system' | 'delivery';
}

export interface Seller {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  verified: boolean;
  categories: string[];
  location: string;
  image: string;
  badges: string[];
  since: string;
}

export const categories = [
  { id: 'dairy', name: 'Молочные', icon: '🥛' },
  { id: 'honey', name: 'Мёд', icon: '🍯' },
  { id: 'bread', name: 'Хлеб', icon: '🍞' },
  { id: 'fruits', name: 'Фрукты', icon: '🍎' },
  { id: 'nuts', name: 'Орехи', icon: '🥜' },
  { id: 'tea', name: 'Чай', icon: '🍵' },
  { id: 'vegetables', name: 'Овощи', icon: '🥬' },
  { id: 'meat', name: 'Мясо', icon: '🥩' },
];

// catFilter values MUST exactly match category_id values stored in Supabase products table.
// Real DB values found in DB: 'fruits', 'vegetables', 'meat', 'dairy', 'honey', 'bread', 'nuts', 'tea'
// AND newer values: 'fruits_vegetables', 'farm_meat', 'organic', 'no_sugar', 'no_gluten', 'no_lactose', 'superfoods', 'snacks'
// catFilters lists ALL possible DB values for each displayed category so counters work regardless of which set was used.
export const catalogCategories = [
  { id: 'fruits_vegetables', name: 'Фрукты и овощи', icon: '🍎', tagFilter: '', catFilters: ['fruits', 'vegetables', 'fruits_vegetables'], color: '#F0FDF4', borderColor: '#BBF7D0' },
  { id: 'farm_meat', name: 'Фермерское мясо и птица', icon: '🥩', tagFilter: 'Фермерское', catFilters: ['meat', 'farm_meat'], color: '#FFF0F0', borderColor: '#FECACA' },
  { id: 'organic', name: 'Органика', icon: '🌿', tagFilter: 'Органик', catFilters: ['organic'], color: '#F0FFF4', borderColor: '#BBF7D0' },
  { id: 'no_sugar', name: 'Без сахара', icon: '🍬', tagFilter: 'Без сахара', catFilters: ['no_sugar'], color: '#FFFBEB', borderColor: '#FDE68A' },
  { id: 'no_gluten', name: 'Без глютена', icon: '🌾', tagFilter: 'Без глютена', catFilters: ['no_gluten'], color: '#FFF7ED', borderColor: '#FED7AA' },
  { id: 'no_lactose', name: 'Без лактозы', icon: '🥛', tagFilter: 'Без лактозы', catFilters: ['dairy', 'no_lactose'], color: '#EFF6FF', borderColor: '#BFDBFE' },
  { id: 'superfoods', name: 'Суперфуды', icon: '⚡', tagFilter: 'Суперфуд', catFilters: ['superfoods', 'nuts', 'honey'], color: '#F5F3FF', borderColor: '#DDD6FE' },
  { id: 'snacks', name: 'Здоровые перекусы', icon: '🥗', tagFilter: 'Перекус', catFilters: ['snacks', 'bread', 'tea'], color: '#F0FDFA', borderColor: '#99F6E4' },
];

export const smartFilters = [
  { id: 'diabetic', label: 'Подходит диабетикам', tag: 'Без сахара' },
  { id: 'vegan', label: 'Веган', tag: 'Веган' },
  { id: 'keto', label: 'Кето', tag: 'Кето' },
  { id: 'high_protein', label: 'Высокий белок', tag: 'Высокий белок' },
  { id: 'halal', label: 'Халяль', tag: 'Халяль' },
  { id: 'no_gmo', label: 'Без ГМО', tag: 'Без ГМО' },
  { id: 'no_preservatives', label: 'Без консервантов', tag: 'Без консервантов' },
  { id: 'kids', label: 'Детское питание', tag: 'Детское питание' },
];

export const preferences = [
  'Без сахара', 'Без глютена', 'Фермерское', 'Без ГМО',
  'Без лактозы', 'Веган', 'Халяль', 'Без консервантов',
  'Органик', 'Детское питание', 'Кето', 'Высокий белок',
];

export const allergenOptions = [
  'Глютен', 'Лактоза', 'Орехи', 'Соя', 'Яйца', 'Рыба', 'Моллюски', 'Пшеница',
];

export const paymentMethods = [
  { id: 'card', label: 'Банковская карта', icon: '💳', detail: '' },
  { id: 'kaspi', label: 'Kaspi Gold', icon: '🏦', detail: 'Перевод по номеру' },
  { id: 'cash', label: 'Наличные', icon: '💵', detail: 'При получении' },
];

export const cities = ['Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе', 'Тараз', 'Павлодар', 'Усть-Каменогорск'];



