
import { Product, UserProfile, Order } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'LIGHTNING BAGGY DENIM',
    price: 118000,
    category: 'Bottoms',
    image: 'https://picsum.photos/id/445/800/1000',
    images: [
      'https://picsum.photos/id/445/800/1000',
      'https://picsum.photos/id/449/800/1000',
      'https://picsum.photos/id/450/800/1000',
      'https://picsum.photos/id/451/800/1000'
    ],
    isNew: true,
    description: 'Heavyweight denim with signature lightning embroidery. Oversized fit.'
  },
  {
    id: '2',
    name: 'Y2K CHROME SHADES',
    price: 45000,
    category: 'Accessories',
    image: 'https://picsum.photos/id/338/800/1000',
    images: [
      'https://picsum.photos/id/338/800/1000',
      'https://picsum.photos/id/339/800/1000'
    ],
    isNew: true,
    description: 'Futuristic wrap-around frames with mirror finish. UV400 protection.'
  },
  {
    id: '3',
    name: 'ACID WASH HOODIE',
    price: 105000,
    category: 'Hoodies',
    image: 'https://picsum.photos/id/621/800/1000',
    images: [
      'https://picsum.photos/id/621/800/1000',
      'https://picsum.photos/id/622/800/1000',
      'https://picsum.photos/id/623/800/1000'
    ],
    description: 'Vintage wash process. Drop shoulder silhouette. Ultra-soft cotton blend.'
  },
  {
    id: '4',
    name: 'CARGO PARACHUTE PANTS',
    price: 98000,
    category: 'Bottoms',
    image: 'https://picsum.photos/id/64/800/1000',
    images: [
      'https://picsum.photos/id/64/800/1000',
      'https://picsum.photos/id/65/800/1000',
      'https://picsum.photos/id/66/800/1000',
      'https://picsum.photos/id/67/800/1000',
      'https://picsum.photos/id/68/800/1000'
    ],
    description: 'Tech-wear inspired nylon fabric. Adjustable drawstrings at hem.'
  },
  {
    id: '5',
    name: 'DISTRESSED KNIT BEANIE',
    price: 35000,
    category: 'Accessories',
    image: 'https://picsum.photos/id/823/800/1000',
    images: [
      'https://picsum.photos/id/823/800/1000'
    ],
    description: 'Hand-distressed detailing. One size fits all. Grunge aesthetic.'
  },
  {
    id: '6',
    name: 'OVERSIZED GRAPHIC TEE',
    price: 65000,
    category: 'Tees',
    image: 'https://picsum.photos/id/177/800/1000',
    images: [
      'https://picsum.photos/id/177/800/1000',
      'https://picsum.photos/id/178/800/1000',
      'https://picsum.photos/id/179/800/1000'
    ],
    isNew: true,
    description: 'Heavyweight 240gsm cotton. Puff print graphic on back.'
  },
  {
    id: '7',
    name: 'BONE STRUCTURE ZIP-UP',
    price: 125000,
    category: 'Hoodies',
    image: 'https://picsum.photos/id/91/800/1000',
    images: [
      'https://picsum.photos/id/91/800/1000',
      'https://picsum.photos/id/92/800/1000'
    ],
    description: 'Full zip hoodie with skeletal structural piping details.'
  },
  {
    id: '8',
    name: 'TACTICAL VEST BLACK',
    price: 85000,
    category: 'Accessories',
    image: 'https://picsum.photos/id/433/800/1000',
    images: [
      'https://picsum.photos/id/433/800/1000',
      'https://picsum.photos/id/434/800/1000'
    ],
    description: 'Multi-pocket utility vest. Layering essential.'
  }
];

export const CATEGORIES = ['All', 'Hoodies', 'Bottoms', 'Tees', 'Accessories'];

export const MOCK_USER: UserProfile = {
  name: 'Mateo Valencia',
  email: 'mateo.v@example.com',
  phone: '+57 300 123 4567',
  address: 'Calle 10 # 5-23, Edificio Centro',
  city: 'Cúcuta, Norte de Santander',
  zip: '540001'
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-9928',
    date: 'Oct 24, 2024',
    status: 'Delivered',
    total: 213000,
    items: [
      {
        productId: '4',
        name: 'CARGO PARACHUTE PANTS',
        image: 'https://picsum.photos/id/64/800/1000',
        price: 98000,
        quantity: 1,
        size: 'M'
      },
      {
        productId: '3',
        name: 'ACID WASH HOODIE',
        image: 'https://picsum.photos/id/621/800/1000',
        price: 105000,
        quantity: 1,
        size: 'L'
      }
    ]
  },
  {
    id: 'ORD-7731',
    date: 'Nov 02, 2024',
    status: 'Shipped',
    total: 125000,
    items: [
      {
        productId: '7',
        name: 'BONE STRUCTURE ZIP-UP',
        image: 'https://picsum.photos/id/91/800/1000',
        price: 125000,
        quantity: 1,
        size: 'XL'
      }
    ]
  },
  {
    id: 'ORD-5510',
    date: 'Nov 05, 2024',
    status: 'Processing',
    total: 85000,
    items: [
      {
        productId: '8',
        name: 'TACTICAL VEST BLACK',
        image: 'https://picsum.photos/id/433/800/1000',
        price: 85000,
        quantity: 1,
        size: 'One Size'
      }
    ]
  },
  {
    id: 'ORD-3301',
    date: 'Aug 10, 2024',
    status: 'Delivered',
    total: 45000,
    items: [
      {
        productId: '2',
        name: 'Y2K CHROME SHADES',
        image: 'https://picsum.photos/id/338/800/1000',
        price: 45000,
        quantity: 1,
        size: 'One Size'
      }
    ]
  }
];
