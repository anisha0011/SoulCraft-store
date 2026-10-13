import type { Category, Product, Order } from '../types';

export const DEMO_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Handmade Gifts',
    slug: 'handmade-gifts',
    description: 'Thoughtful gifts created by hand for someone special.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'cat-2',
    name: 'Home Décor',
    slug: 'home-decor',
    description: 'Beautiful pieces to add warmth to your living space.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'cat-3',
    name: 'Personalized Gifts',
    slug: 'personalized-gifts',
    description: 'Custom-made items with names, initials, or special dates.',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'cat-4',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Handcrafted jewelry and lifestyle accessories.',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop'
  }
];

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Floral Handmade Gift Box',
    slug: 'floral-handmade-gift-box',
    description: 'A beautifully crafted gift box decorated with dried and artificial flowers. Perfect for weddings, birthdays, and special occasions. Each box is carefully assembled by hand, ensuring a unique arrangement of florals.',
    shortDescription: 'Beautiful handcrafted floral gift box.',
    categoryId: 'cat-1',
    price: 999,
    compareAtPrice: 1299,
    salePrice: 999,
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
    sku: 'SC-GB-001',
    stock: 15,
    lowStockThreshold: 5,
    rating: 4.8,
    reviewCount: 24,
    tags: ['floral', 'gift box', 'wedding'],
    materials: ['Hardboard', 'Paper', 'Dried Flowers'],
    dimensions: '10x10x5 inches',
    colors: ['Pink', 'White', 'Pastel'],
    occasion: ['Wedding', 'Birthday', 'Anniversary'],
    isCustomizable: true,
    customizationOptions: ['Name Tag', 'Color Theme'],
    processingTime: '3-5 business days',
    shippingInfo: 'Ships securely in a protective box. Free shipping on orders over ₹999.',
    careInstructions: 'Keep away from direct sunlight to prevent flower fading.',
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Personalized Name Frame',
    slug: 'personalized-name-frame',
    description: 'Elegant custom name frame featuring handmade paper quilling. A perfect keepsake for newborns, couples, or as a housewarming gift. The frame is deep set to protect the 3D quilling art.',
    shortDescription: 'Custom quilled name frame.',
    categoryId: 'cat-3',
    price: 1499,
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=1000&auto=format&fit=crop'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=1000&auto=format&fit=crop',
    sku: 'SC-NF-002',
    stock: 50,
    lowStockThreshold: 10,
    rating: 4.9,
    reviewCount: 42,
    tags: ['frame', 'personalized', 'quilling'],
    materials: ['Wood', 'Glass', 'Quilling Paper'],
    dimensions: '12x8 inches',
    colors: ['Custom'],
    occasion: ['Baby Shower', 'Wedding', 'Housewarming'],
    isCustomizable: true,
    customizationOptions: ['Name', 'Background Color', 'Quilling Colors'],
    processingTime: '5-7 business days',
    shippingInfo: 'Bubble wrapped and securely boxed.',
    careInstructions: 'Wipe glass with a dry cloth.',
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Handmade Resin Keychain',
    slug: 'handmade-resin-keychain',
    description: 'Beautiful crystal-clear resin keychains embedded with real dried flowers and gold flakes. Each piece is unique.',
    shortDescription: 'Floral resin keychain with gold flakes.',
    categoryId: 'cat-4',
    price: 299,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop',
    sku: 'SC-RK-003',
    stock: 100,
    lowStockThreshold: 20,
    rating: 4.5,
    reviewCount: 89,
    tags: ['resin', 'keychain', 'floral'],
    materials: ['Epoxy Resin', 'Dried Flowers', 'Metal Alloy'],
    dimensions: '2x2 inches',
    colors: ['Pink', 'Blue', 'Purple', 'Clear'],
    occasion: ['Birthday', 'Return Gift'],
    isCustomizable: true,
    customizationOptions: ['Initial Letter', 'Flower Color'],
    processingTime: '2-3 business days',
    shippingInfo: 'Ships in a small padded envelope.',
    careInstructions: 'Avoid prolonged exposure to extreme heat.',
    isFeatured: false,
    isBestseller: false,
    isNew: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Macrame Wall Hanging',
    slug: 'macrame-wall-hanging',
    description: 'Hand-knotted macrame wall hanging made from 100% natural cotton cord. Adds a beautiful boho touch to any room.',
    shortDescription: 'Boho style macrame wall decor.',
    categoryId: 'cat-2',
    price: 1299,
    compareAtPrice: 1599,
    salePrice: 1299,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop',
    sku: 'SC-MW-004',
    stock: 8,
    lowStockThreshold: 3,
    rating: 4.7,
    reviewCount: 15,
    tags: ['macrame', 'wall decor', 'boho'],
    materials: ['Cotton Cord', 'Wooden Dowel'],
    dimensions: '18x30 inches',
    colors: ['Off-white', 'Mustard', 'Sage Green'],
    occasion: ['Housewarming'],
    isCustomizable: false,
    customizationOptions: [],
    processingTime: '4-6 business days',
    shippingInfo: 'Rolled and shipped in a tube or long box.',
    careInstructions: 'Spot clean only. Gently comb fringe if tangled.',
    isFeatured: true,
    isBestseller: false,
    isNew: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const DEMO_ORDERS: Order[] = [
  {
    id: 'SC-2026-001284',
    customerName: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543210',
    items: [
      {
        product: DEMO_PRODUCTS[0],
        quantity: 1,
        customization: {
          name: 'To Anjali'
        }
      }
    ],
    total: 999,
    status: 'PROCESSING',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    shippingAddress: {
      fullName: 'Priya Sharma',
      street: '123 Main St, Apt 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400001',
      country: 'India'
    }
  }
];
