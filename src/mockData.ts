export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  scent: string;
  category: string; // 'woody', 'floral', 'citrus', 'aquatic', 'oriental', 'powdery', 'luxury'
  categoryName: string; // '우디', '플로럴' 등
  stars: number;
  rating: number;
  reviewCount: number;
  badge?: 'BEST' | 'NEW' | 'SALE';
  imgBg?: string;
  imageType: 'santal' | 'blackopium' | 'libre' | 'bleu' | 'missdior' | 'aventus' | 'generic';
  description?: string;
  capacity?: string;
  imageUrl?: string;
}

export interface OrderItem {
  id: string;
  orderNo: string;
  productName: string;
  customerName: string;
  price: number;
  status: 'new' | 'prep' | 'ship' | 'done';
  statusLabel: string;
  date: string;
}

export interface ReportItem {
  id: string;
  title: string;
  reporter: string;
  time: string;
  type: 'review' | 'product' | 'inquiry';
  status: 'pending' | 'blinded' | 'resolved';
}

export interface VendorItem {
  id: string;
  name: string;
  email: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'Debaser',
    brand: 'ScentAtelier',
    price: 210000,
    originalPrice: 240000,
    scent: '잘 익은 무화과 · 코코넛 밀크 · 블론드 우드',
    category: 'woody',
    categoryName: 'STUDIO JUICES',
    stars: 5,
    rating: 4.9,
    reviewCount: 1420,
    badge: 'BEST',
    imageType: 'santal',
    description: 'The wild shrill of Black Francis coming through the radio in the August heat. Ripe fig, iris, coconut milk, and dry blonde woods capture the essence of hot summer air, sweat, and indie rock.',
    capacity: '50ml',
    imageUrl: '/img/p1.png',
  },
  {
    id: 'p2',
    name: 'I Don\'t Know What',
    brand: 'ScentAtelier',
    price: 210000,
    scent: '버가못 · 이소 E 슈퍼 · 베티버',
    category: 'oriental',
    categoryName: 'FRAGRANCE ENHANCER',
    stars: 5,
    rating: 4.8,
    reviewCount: 3210,
    badge: 'BEST',
    imgBg: '#F5F5F5',
    imageType: 'blackopium',
    description: 'A fragrance enhancer that adds a certain "je ne sais quoi" to any scent, or can be worn alone for a clean, modern radiance. Formulated with bergamot, Iso E Super, civetone, and vetiver.',
    capacity: '50ml',
    imageUrl: '/img/p10.png',
  },
  {
    id: 'p3',
    name: 'Cowboy Grass',
    brand: 'ScentAtelier',
    price: 210000,
    scent: '로즈우드 · 야생 타임 · 세이지브러시',
    category: 'woody',
    categoryName: 'THE AMERICAN WEST',
    stars: 4,
    rating: 4.7,
    reviewCount: 950,
    imgBg: '#F5F5F5',
    imageType: 'libre',
    description: 'For robbers, lawmen, and peaceable folks. Wild thyme, flowering sagebrush, and clean wood notes recreate the dry, dusty plains of the American West.',
    capacity: '50ml',
    imageUrl: '/img/p2.png',
  },
  {
    id: 'p4',
    name: 'Bowmakers',
    brand: 'ScentAtelier',
    price: 210000,
    scent: '바이올린 바니쉬 · 마호가니 · 앰버 파인',
    category: 'woody',
    categoryName: 'STUDIO JUICES',
    stars: 5,
    rating: 4.9,
    reviewCount: 1204,
    imgBg: '#F5F5F5',
    imageType: 'bleu',
    description: 'In the woodshops of Massachusetts, craftsmen built violins out of aged mahogany, maple wood, and thick golden varnish. Recreates the warm, resinous aroma of old instruments.',
    capacity: '50ml',
    imageUrl: '/img/p4.png',
  },
  {
    id: 'p5',
    name: 'Radio Bombay',
    brand: 'ScentAtelier',
    price: 210000,
    originalPrice: 240000,
    scent: '샌달우드 · 구리 · 시더우드',
    category: 'woody',
    categoryName: 'STUDIO JUICES',
    stars: 5,
    rating: 4.8,
    reviewCount: 880,
    badge: 'SALE',
    imgBg: '#F5F5F5',
    imageType: 'missdior',
    description: 'A transistor radio built inside a wooden cabinet in Bandra. Warm sandalwood heated by copper tubes, releasing a metallic, creamy, cedar-scented tune.',
    capacity: '50ml',
    imageUrl: '/img/p5.png',
  },
  {
    id: 'p6',
    name: 'Steamed Rainbow',
    brand: 'ScentAtelier',
    price: 210000,
    scent: '레드 만다린 · 오렌지 블로썸 · 블루 그래스',
    category: 'citrus',
    categoryName: 'STUDIO JUICES',
    stars: 5,
    rating: 4.9,
    reviewCount: 1540,
    badge: 'NEW',
    imgBg: '#F5F5F5',
    imageType: 'aventus',
    description: 'An olfactory spectrum representing color in steam. Notes of red mandarin, yellow clay, green cedar, blue grass, and violet rain create a damp, colorful atmosphere.',
    capacity: '50ml',
    imageUrl: '/img/p6.png',
  },
  {
    id: 'p7',
    name: 'Burning Barbershop',
    brand: 'ScentAtelier',
    price: 210000,
    scent: '스피어민트 · 라임 · 바닐라 · 라벤더',
    category: 'floral',
    categoryName: 'STUDIO JUICES',
    stars: 4,
    rating: 4.6,
    reviewCount: 720,
    imgBg: '#F5F5F5',
    imageType: 'generic',
    description: 'A fire broke out in the Curling Bros. Barbershop in Westlake, N.Y., in 1891. The shaving tonics containing spearmint, lavender, and lime burned, leaving a smoky, sweet scent.',
    capacity: '50ml',
    imageUrl: '/img/p7.png',
  },
  {
    id: 'p8',
    name: 'Mississippi Medicine',
    brand: 'ScentAtelier',
    price: 210000,
    scent: '레드 시더 · 버치 타르 · 인센스 향',
    category: 'woody',
    categoryName: 'STUDIO JUICES',
    stars: 5,
    rating: 4.8,
    reviewCount: 1105,
    badge: 'BEST',
    imgBg: '#F5F5F5',
    imageType: 'generic',
    description: 'Inspired by the myths and rituals of the southeastern death cult. A dark blend of native red cedar, smoky birch tar, pine incense, and swamp cypress.',
    capacity: '50ml',
    imageUrl: '/img/p8.png',
  },
  {
    id: 'p9',
    name: 'Jasmine Yucatan',
    brand: 'ScentAtelier',
    price: 210000,
    originalPrice: 240000,
    scent: '워터 노트 · 자스민 · 코팔 레진',
    category: 'floral',
    categoryName: 'STUDIO JUICES',
    stars: 4,
    rating: 4.5,
    reviewCount: 650,
    badge: 'SALE',
    imgBg: '#F5F5F5',
    imageType: 'generic',
    description: 'Jasmine vines creeping over ancient stone pyramids in the jungle. A humid blend of warm water notes, wild jasmine, copal resin, and damp green foliage.',
    capacity: '50ml',
    imageUrl: '/img/p9.png',
  },
];

export const initialOrders: OrderItem[] = [
  {
    id: 'o1',
    orderNo: 'SA-2025-11284',
    productName: 'Santal 33 · 100ml',
    customerName: '김지현',
    price: 248000,
    status: 'new',
    statusLabel: '신규주문',
    date: '2026-05-27',
  },
  {
    id: 'o2',
    orderNo: 'SA-2025-11283',
    productName: 'Rose 31 · 50ml',
    customerName: '이민준',
    price: 168000,
    status: 'prep',
    statusLabel: '배송준비',
    date: '2026-05-26',
  },
  {
    id: 'o3',
    orderNo: 'SA-2025-11280',
    productName: 'Another 13 · 100ml',
    customerName: '박소연',
    price: 224000,
    status: 'ship',
    statusLabel: '배송중',
    date: '2026-05-25',
  },
  {
    id: 'o4',
    orderNo: 'SA-2025-11275',
    productName: 'Noir 29 · 100ml',
    customerName: '최준혁',
    price: 198000,
    status: 'done',
    statusLabel: '배송완료',
    date: '2026-05-24',
  },
];

export const initialReports: ReportItem[] = [
  {
    id: 'r1',
    title: '허위 리뷰 신고 — Aventus 상품',
    reporter: 'user_4821',
    time: '3분 전',
    type: 'review',
    status: 'pending',
  },
  {
    id: 'r2',
    title: '위조품 의심 신고 — Black Opium 50ml',
    reporter: 'user_2094',
    time: '17분 전',
    type: 'product',
    status: 'pending',
  },
  {
    id: 'r3',
    title: '욕설 포함 리뷰 신고 — Santal 33',
    reporter: 'user_5510',
    time: '42분 전',
    type: 'review',
    status: 'pending',
  },
  {
    id: 'r4',
    title: '스팸 리뷰 의심 — Miss Dior',
    reporter: 'user_3871',
    time: '1시간 전',
    type: 'review',
    status: 'pending',
  },
];

export const initialVendors: VendorItem[] = [
  {
    id: 'v1',
    name: '나이스 퍼퓸 (주)',
    email: 'contact@niceperfume.kr',
    description: '수입 향수 전문 디스트리뷰터',
    status: 'pending',
  },
  {
    id: 'v2',
    name: '향기로운 사람들',
    email: 'hello@scentpeople.co',
    description: '국내 디자이너 프래그런스 브랜드',
    status: 'pending',
  },
  {
    id: 'v3',
    name: 'Parfum Studio Co.',
    email: 'studio@parfum.kr',
    description: '천연 아로마 독립 향수 아틀리에',
    status: 'pending',
  },
  {
    id: 'v4',
    name: 'Niche Fragrance KR',
    email: 'info@nichefragrance.kr',
    description: '유럽 희귀 니치 향수 수입사',
    status: 'pending',
  },
];
