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

export const catalogCategories = [
  { id: 'farm_meat', name: 'Фермерское мясо и птица', icon: '🥩', tagFilter: 'Фермерское', catFilter: 'meat', color: '#FFF0F0', borderColor: '#FECACA' },
  { id: 'organic', name: 'Органика', icon: '🌿', tagFilter: 'Органик', catFilter: '', color: '#F0FFF4', borderColor: '#BBF7D0' },
  { id: 'no_sugar', name: 'Без сахара', icon: '🍬', tagFilter: 'Без сахара', catFilter: '', color: '#FFFBEB', borderColor: '#FDE68A' },
  { id: 'no_gluten', name: 'Без глютена', icon: '🌾', tagFilter: 'Без глютена', catFilter: '', color: '#FFF7ED', borderColor: '#FED7AA' },
  { id: 'no_lactose', name: 'Без лактозы', icon: '🥛', tagFilter: 'Без лактозы', catFilter: '', color: '#EFF6FF', borderColor: '#BFDBFE' },
  { id: 'superfoods', name: 'Суперфуды', icon: '⚡', tagFilter: 'Суперфуд', catFilter: 'superfoods', color: '#F5F3FF', borderColor: '#DDD6FE' },
  { id: 'snacks', name: 'Здоровые перекусы', icon: '🥗', tagFilter: 'Перекус', catFilter: 'snacks', color: '#F0FDFA', borderColor: '#99F6E4' },
  { id: 'eco_grocery', name: 'Эко-бакалея', icon: '🛒', tagFilter: 'Без ГМО', catFilter: '', color: '#F7FEE7', borderColor: '#BEF264' },
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
  { id: 'card', label: 'Банковская карта', icon: '💳', detail: '**** 4532' },
  { id: 'kaspi', label: 'Kaspi Pay', icon: '🏦', detail: 'Kaspi Gold' },
  { id: 'cash', label: 'Наличные', icon: '💵', detail: 'При получении' },
];

export const cities = ['Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе', 'Тараз', 'Павлодар', 'Усть-Каменогорск'];

export const mockSellers: Seller[] = [
  {
    id: 's1',
    name: 'Алтай Фарм',
    description: 'Фермерский мёд и продукты пчеловодства с экологически чистых пасек Восточного Казахстана',
    rating: 4.9,
    reviewCount: 412,
    productCount: 18,
    verified: true,
    categories: ['Мёд', 'Органика'],
    location: 'Восточный Казахстан',
    image: 'https://images.unsplash.com/photo-1773070784326-461cca3a4db8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwZnJlc2glMjB2ZWdldGFibGVzJTIwc2VsbGVyJTIwbWFya2V0fGVufDF8fHx8MTc3NDg2NDY1NHww&ixlib=rb-4.1.0&q=80&w=1080',
    badges: ['Проверенный состав', 'Органик', 'Без Е-добавок'],
    since: '2019',
  },
  {
    id: 's2',
    name: 'Зелёная Долина',
    description: 'Молочные продукты от коров свободного выпаса. Пастеризация при щадящей температуре без консервантов',
    rating: 4.7,
    reviewCount: 289,
    productCount: 24,
    verified: true,
    categories: ['Молочные', 'Фермерское'],
    location: 'Алматинская область',
    image: 'https://images.unsplash.com/photo-1562178101-02e243762ffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwaGVhbHRoeSUyMGZvb2QlMjBtYXJrZXQlMjJiYW5uZXIlMjJwcm9tb3Rpb258ZW58MXx8fHwxNzc0ODY0NjUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    badges: ['Фермерское', 'Без консервантов'],
    since: '2021',
  },
  {
    id: 's3',
    name: 'ЧайХана Органик',
    description: 'Высокогорные чаи и травяные сборы из экологически чистых районов Туркестанской области',
    rating: 4.8,
    reviewCount: 176,
    productCount: 32,
    verified: true,
    categories: ['Чай', 'Органика', 'Суперфуды'],
    location: 'Туркестанская область',
    image: 'https://images.unsplash.com/photo-1717002997856-8f68e644fbd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBlcmZvb2QlMjBoZWFsdGh5JTIwbnV0cyUyMHNlZWRzJTIwYmVycmllc3xlbnwxfHx8fDE3NzQ4NjQ2NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    badges: ['Органик', 'Без ГМО', 'Проверенный состав'],
    since: '2020',
  },
  {
    id: 's4',
    name: 'НатурНат',
    description: 'Орехи, сухофрукты и суперфуды органического производства. Без пестицидов и химических удобрений',
    rating: 4.8,
    reviewCount: 245,
    productCount: 45,
    verified: true,
    categories: ['Орехи', 'Суперфуды', 'Перекусы'],
    location: 'Южный Казахстан',
    image: 'https://images.unsplash.com/photo-1641893638805-5942e0afbec4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwbWVhdCUyMGNoaWNrZW4lMjBuYXR1cmFsJTIwb3JnYW5pY3xlbnwxfHx8fDE3NzQ4NjQ2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    badges: ['100% Натурально', 'Органик', 'Веган'],
    since: '2018',
  },
  {
    id: 's5',
    name: 'БериФреш',
    description: 'Свежие сезонные ягоды и фрукты с фермерских полей Жамбылской области',
    rating: 4.5,
    reviewCount: 98,
    productCount: 12,
    verified: false,
    categories: ['Фрукты', 'Фермерское'],
    location: 'Жамбылская область',
    image: 'https://images.unsplash.com/photo-1763080348919-0a4969e31afc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbHV0ZW4lMjBmcmVlJTIwaGVhbHRoeSUyMHNuYWNrJTIwYmFyc3xlbnwxfHx8fDE3NzQ4NjQ2NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    badges: ['Фермерское'],
    since: '2023',
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Фермерский мёд горный',
    price: 3500,
    oldPrice: 4200,
    image: 'https://images.unsplash.com/photo-1645549826194-1956802d83c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwaG9uZXklMjBqYXIlMjBuYXR1cmFsfGVufDF8fHx8MTc3NDg1MTg0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'honey',
    supplier: 'Алтай Фарм',
    supplierId: 's1',
    supplierVerified: true,
    supplierRating: 4.9,
    rating: 4.9,
    reviewCount: 234,
    tags: ['Без сахара', 'Органик', 'Фермерское'],
    allergens: [],
    origin: 'Восточный Казахстан',
    certificates: [
      { name: 'ISO 22000', issuer: 'SGS Kazakhstan', date: '2025-06-15', valid: true },
      { name: 'Органик Стандарт KZ', issuer: 'НЦЭ РК', date: '2025-03-01', valid: true },
    ],
    labTests: [
      { name: 'Тест на пестициды', lab: 'КазЛаб', date: '2025-11-20', result: 'Не обнаружено', passed: true },
      { name: 'Тест на антибиотики', lab: 'КазЛаб', date: '2025-11-20', result: 'Не обнаружено', passed: true },
    ],
    description: 'Натуральный горный мёд из экологически чистых пасек Восточного Казахстана. Собран вручную, без термообработки.',
    composition: ['Мёд натуральный 100%'],
    weight: '500 г',
    badges: ['Проверенный состав', 'Без Е-добавок', '100% Натурально'],
  },
  {
    id: '2',
    name: 'Молоко фермерское 3.2%',
    price: 890,
    image: 'https://images.unsplash.com/photo-1768850418251-17480117ac9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZhcm0lMjBtaWxrJTIwYm90dGxlfGVufDF8fHx8MTc3NDg1MTg0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'dairy',
    supplier: 'Зелёная Долина',
    supplierId: 's2',
    supplierVerified: true,
    supplierRating: 4.7,
    rating: 4.7,
    reviewCount: 189,
    tags: ['Фермерское', 'Без консервантов', 'Без ГМО'],
    allergens: ['Лактоза'],
    origin: 'Алматинская область',
    certificates: [
      { name: 'ГОСТ Р 52054', issuer: 'Госстандарт РК', date: '2025-08-10', valid: true },
    ],
    labTests: [
      { name: 'Микробиологический тест', lab: 'АлмаЛаб', date: '2025-12-01', result: 'Норма', passed: true },
    ],
    description: 'Свежее фермерское молоко от коров свободного выпаса. Пастеризовано при щадящей температуре.',
    composition: ['Молоко коровье цельное'],
    weight: '1 л',
    badges: ['Проверенный состав', 'Без Е-добавок'],
  },
  {
    id: '3',
    name: 'Зелёный чай Алатау',
    price: 1200,
    oldPrice: 1500,
    image: 'https://images.unsplash.com/photo-1739099778372-6181f31c341c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZ3JlZW4lMjB0ZWElMjBwYWNrYWdlfGVufDF8fHx8MTc3NDg1MjA0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'tea',
    supplier: 'ЧайХана Органик',
    supplierId: 's3',
    supplierVerified: true,
    supplierRating: 4.8,
    rating: 4.8,
    reviewCount: 156,
    tags: ['Органик', 'Без ГМО'],
    allergens: [],
    origin: 'Туркестанская область',
    certificates: [
      { name: 'Органик Стандарт KZ', issuer: 'НЦЭ РК', date: '2025-05-20', valid: true },
    ],
    labTests: [
      { name: 'Тест на тяжёлые металлы', lab: 'КазЛаб', date: '2025-10-15', result: 'Не обнаружено', passed: true },
    ],
    description: 'Высокогорный зелёный чай, выращенный на склонах Алатау без химических удобрений.',
    composition: ['Листья зелёного чая'],
    weight: '200 г',
    badges: ['Органик', 'Проверенный состав'],
  },
  {
    id: '4',
    name: 'Свежие ягоды микс',
    price: 2800,
    image: 'https://images.unsplash.com/flagged/photo-1570197275784-ad9f674f9231?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG9yZ2FuaWMlMjBmcnVpdHMlMjBiZXJyaWVzfGVufDF8fHx8MTc3NDg1MjA0OHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'fruits',
    supplier: 'БериФреш',
    supplierId: 's5',
    supplierVerified: false,
    supplierRating: 4.5,
    rating: 4.5,
    reviewCount: 78,
    tags: ['Фермерское', 'Без ГМО'],
    allergens: [],
    origin: 'Жамбылская область',
    certificates: [],
    labTests: [
      { name: 'Тест на пестициды', lab: 'АгроЛаб', date: '2025-09-10', result: 'Следы в пределах нормы', passed: true },
    ],
    description: 'Свежий микс из сезонных ягод: малина, черника, клубника.',
    composition: ['Малина', 'Черника', 'Клубника'],
    weight: '400 г',
    badges: ['Фермерское'],
  },
  {
    id: '5',
    name: 'Хлеб ремесленный на закваске',
    price: 750,
    image: 'https://images.unsplash.com/photo-1649675602947-81a41c1ba4af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwYnJlYWQlMjBiYWtlcnklMjBhcnRpc2FufGVufDF8fHx8MTc3NDg1MjA0OHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'bread',
    supplier: 'Пекарня «Дом»',
    supplierId: 's2',
    supplierVerified: true,
    supplierRating: 4.7,
    rating: 4.6,
    reviewCount: 312,
    tags: ['Без консервантов', 'Без сахара'],
    allergens: ['Глютен'],
    origin: 'Алматы',
    certificates: [
      { name: 'HACCP', issuer: 'TUV Казахстан', date: '2025-04-10', valid: true },
    ],
    labTests: [],
    description: 'Ремесленный хлеб на натуральной закваске. Долгая ферментация 24 часа.',
    composition: ['Мука пшеничная', 'Вода', 'Соль', 'Закваска'],
    weight: '650 г',
    badges: ['Без Е-добавок', 'Без сахара'],
  },
  {
    id: '6',
    name: 'Миндаль сырой органик',
    price: 4200,
    oldPrice: 4800,
    image: 'https://images.unsplash.com/photo-1769255484605-a245be3f1bf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwYWxtb25kcyUyMG51dHMlMjBib3dsfGVufDF8fHx8MTc3NDg1MjA0OHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'nuts',
    supplier: 'НатурНат',
    supplierId: 's4',
    supplierVerified: true,
    supplierRating: 4.8,
    rating: 4.8,
    reviewCount: 145,
    tags: ['Органик', 'Веган', 'Без ГМО', 'Суперфуд'],
    allergens: ['Орехи'],
    origin: 'Южный Казахстан',
    certificates: [
      { name: 'EU Organic', issuer: 'Ecocert', date: '2025-07-01', valid: true },
    ],
    labTests: [
      { name: 'Тест на афлатоксины', lab: 'КазЛаб', date: '2025-11-05', result: 'Не обнаружено', passed: true },
    ],
    description: 'Органический сырой миндаль, выращенный без пестицидов в садах Южного Казахстана.',
    composition: ['Миндаль сырой 100%'],
    weight: '300 г',
    badges: ['Органик', 'Веган', 'Проверенный состав'],
  },
  {
    id: '7',
    name: 'Говядина фермерская охлаждённая',
    price: 5800,
    oldPrice: 6500,
    image: 'https://images.unsplash.com/photo-1641893638805-5942e0afbec4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwbWVhdCUyMGNoaWNrZW4lMjBuYXR1cmFsJTIwb3JnYW5pY3xlbnwxfHx8fDE3NzQ4NjQ2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'meat',
    supplier: 'Алтай Фарм',
    supplierId: 's1',
    supplierVerified: true,
    supplierRating: 4.9,
    rating: 4.7,
    reviewCount: 87,
    tags: ['Фермерское', 'Халяль', 'Без ГМО', 'Высокий белок'],
    allergens: [],
    origin: 'Восточный Казахстан',
    certificates: [
      { name: 'Халяль сертификат', issuer: 'ДУМК РК', date: '2025-09-01', valid: true },
      { name: 'Ветеринарный контроль', issuer: 'МСХ РК', date: '2026-01-10', valid: true },
    ],
    labTests: [
      { name: 'Тест на антибиотики', lab: 'КазЛаб', date: '2025-12-15', result: 'Не обнаружено', passed: true },
      { name: 'Тест на гормоны', lab: 'КазЛаб', date: '2025-12-15', result: 'Не обнаружено', passed: true },
    ],
    description: 'Охлаждённая говядина от коров свободного выпаса. Без гормонов роста и антибиотиков.',
    composition: ['Говядина 100%'],
    weight: '1 кг',
    badges: ['Проверенный состав', 'Халяль', 'Без Е-добавок'],
  },
  {
    id: '8',
    name: 'Протеиновые батончики без сахара',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1763080348919-0a4969e31afc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbHV0ZW4lMjBmcmVlJTIwaGVhbHRoeSUyMHNuYWNrJTIwYmFyc3xlbnwxfHx8fDE3NzQ4NjQ2NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'snacks',
    supplier: 'НатурНат',
    supplierId: 's4',
    supplierVerified: true,
    supplierRating: 4.8,
    rating: 4.6,
    reviewCount: 203,
    tags: ['Без сахара', 'Без глютена', 'Высокий белок', 'Кето', 'Перекус'],
    allergens: ['Орехи'],
    origin: 'Алматы',
    certificates: [
      { name: 'ISO 22000', issuer: 'SGS Kazakhstan', date: '2025-11-01', valid: true },
    ],
    labTests: [
      { name: 'Тест на подсластители', lab: 'АлмаЛаб', date: '2025-10-20', result: 'Не обнаружено', passed: true },
    ],
    description: 'Протеиновые батончики без сахара и глютена. Подходят для кето-диеты и спортивного питания.',
    composition: ['Изолят сывороточного протеина', 'Миндаль', 'Кокосовое масло', 'Стевия'],
    weight: '6 × 60 г',
    badges: ['Без сахара', 'Без Е-добавок', 'Высокий белок'],
  },
  {
    id: '9',
    name: 'Суперфуд микс (семена чиа, льна, кунжута)',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1717002997856-8f68e644fbd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBlcmZvb2QlMjBoZWFsdGh5JTIwbnV0cyUyMHNlZWRzJTIwYmVycmllc3xlbnwxfHx8fDE3NzQ4NjQ2NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'superfoods',
    supplier: 'НатурНат',
    supplierId: 's4',
    supplierVerified: true,
    supplierRating: 4.8,
    rating: 4.9,
    reviewCount: 118,
    tags: ['Веган', 'Органик', 'Без ГМО', 'Суперфуд', 'Кето'],
    allergens: [],
    origin: 'Южный Казахстан',
    certificates: [
      { name: 'EU Organic', issuer: 'Ecocert', date: '2025-08-15', valid: true },
    ],
    labTests: [
      { name: 'Тест на тяжёлые металлы', lab: 'КазЛаб', date: '2025-11-10', result: 'Не обнаружено', passed: true },
    ],
    description: 'Смесь органических семян чиа, льна и кунжута — идеальный источник омега-3 и клетчатки.',
    composition: ['Семена чиа', 'Семена льна', 'Семена кунжута'],
    weight: '300 г',
    badges: ['Органик', 'Веган', '100% Натурально'],
  },
  {
    id: '10',
    name: 'Кефир без лактозы 2.5%',
    price: 680,
    image: 'https://images.unsplash.com/photo-1768850418251-17480117ac9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZhcm0lMjBtaWxrJTIwYm90dGxlfGVufDF8fHx8MTc3NDg1MTg0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'dairy',
    supplier: 'Зелёная Долина',
    supplierId: 's2',
    supplierVerified: true,
    supplierRating: 4.7,
    rating: 4.5,
    reviewCount: 95,
    tags: ['Без лактозы', 'Без консервантов', 'Без ГМО'],
    allergens: [],
    origin: 'Алматинская область',
    certificates: [
      { name: 'ГОСТ Р 52093', issuer: 'Госстандарт РК', date: '2025-09-01', valid: true },
    ],
    labTests: [
      { name: 'Тест на лактозу', lab: 'АлмаЛаб', date: '2025-11-28', result: 'Не обнаружено', passed: true },
    ],
    description: 'Кефир без лактозы для людей с непереносимостью молочного сахара.',
    composition: ['Молоко обезжиренное', 'Закваска кефирная'],
    weight: '500 мл',
    badges: ['Без лактозы', 'Без Е-добавок', 'Проверенный состав'],
  },
];

export const mockOrders: Order[] = [
  {
    id: 'PF-20260328-001',
    items: [
      { product: products[0], quantity: 1 },
      { product: products[1], quantity: 2 },
    ],
    status: 'in_transit',
    date: '28 марта 2026',
    total: 5280,
    deliveryType: 'Стандартная',
    paymentMethod: 'Kaspi Pay',
    trackingSteps: [
      { label: 'Заказ принят', done: true, time: '28 мар, 10:30' },
      { label: 'Собран на складе', done: true, time: '28 мар, 14:15' },
      { label: 'Передан курьеру', done: true, time: '29 мар, 09:00' },
      { label: 'В пути к вам', done: true, time: '30 мар, 11:00' },
      { label: 'Доставлен', done: false },
    ],
  },
  {
    id: 'PF-20260320-039',
    items: [
      { product: products[2], quantity: 2 },
      { product: products[4], quantity: 1 },
    ],
    status: 'delivered',
    date: '20 марта 2026',
    total: 3150,
    deliveryType: 'Экспресс',
    paymentMethod: 'Банковская карта',
    trackingSteps: [
      { label: 'Заказ принят', done: true, time: '20 мар, 08:00' },
      { label: 'Собран на складе', done: true, time: '20 мар, 09:30' },
      { label: 'Передан курьеру', done: true, time: '20 мар, 10:00' },
      { label: 'В пути к вам', done: true, time: '20 мар, 10:45' },
      { label: 'Доставлен', done: true, time: '20 мар, 12:10' },
    ],
    rated: true,
    rating: 5,
  },
  {
    id: 'PF-20260310-015',
    items: [
      { product: products[5], quantity: 1 },
    ],
    status: 'cancelled',
    date: '10 марта 2026',
    total: 4200,
    deliveryType: 'Стандартная',
    paymentMethod: 'Наличные',
    trackingSteps: [
      { label: 'Заказ принят', done: true, time: '10 мар, 15:00' },
      { label: 'Отменён покупателем', done: true, time: '10 мар, 15:30' },
    ],
  },
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    productId: '1',
    productName: 'Фермерский мёд горный',
    rating: 5,
    text: 'Отличный мёд! Натуральный вкус, очень ароматный. Дети в восторге.',
    date: '25 марта 2026',
    hasPhoto: true,
  },
  {
    id: 'r2',
    productId: '3',
    productName: 'Зелёный чай Алатау',
    rating: 4,
    text: 'Хороший чай, приятный вкус. Доставили быстро.',
    date: '18 марта 2026',
    hasPhoto: false,
  },
];

export const mockSubscriptions: Subscription[] = [
  {
    id: 's1',
    productId: '2',
    productName: 'Молоко фермерское 3.2%',
    frequency: 'Каждую неделю',
    nextDelivery: '4 апреля 2026',
    active: true,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Заказ в пути',
    message: 'Ваш заказ PF-20260328-001 передан курьеру и будет доставлен сегодня.',
    time: '2 часа назад',
    read: false,
    type: 'delivery',
  },
  {
    id: 'n2',
    title: 'Скидка 20% на чай',
    message: 'Только сегодня — скидка 20% на весь зелёный чай от ЧайХана Органик!',
    time: '5 часов назад',
    read: false,
    type: 'promo',
  },
  {
    id: 'n3',
    title: 'Заказ доставлен',
    message: 'Заказ PF-20260320-039 успешно доставлен. Оцените качество!',
    time: '10 дней назад',
    read: true,
    type: 'order',
  },
  {
    id: 'n4',
    title: 'Новый продавец верифицирован',
    message: 'БериФреш прошёл проверку и получил статус верифицированного продавца.',
    time: '15 дней назад',
    read: true,
    type: 'system',
  },
];
