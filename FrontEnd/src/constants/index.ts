
import { Product, UserProfile, Order, Collection } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'LIGHTNING BAGGY DENIM',
    price: 118000,
    category: 'Bottoms',
    collectionId: '1', // The Denim Edit
    image: 'https://picsum.photos/id/445/800/1000',
    images: [
      'https://picsum.photos/id/445/800/1000',
      'https://picsum.photos/id/449/800/1000',
      'https://picsum.photos/id/450/800/1000',
      'https://picsum.photos/id/451/800/1000'
    ],
    isNew: true,
    description: 'Heavyweight denim with signature lightning embroidery. Oversized fit.',
    colors: ['Blue'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '2',
    name: 'Y2K CHROME SHADES',
    price: 45000,
    category: 'Accessories',
    collectionId: '3', // Metal & Chrome
    image: 'https://picsum.photos/id/338/800/1000',
    images: [
      'https://picsum.photos/id/338/800/1000',
      'https://picsum.photos/id/339/800/1000'
    ],
    isNew: true,
    description: 'Futuristic wrap-around frames with mirror finish. UV400 protection.',
    colors: ['Silver'],
    sizes: ['One Size']
  },
  {
    id: '3',
    name: 'ACID WASH HOODIE',
    price: 105000,
    category: 'Hoodies',
    collectionId: '2', // Oversized Hoodies
    image: 'https://picsum.photos/id/621/800/1000',
    images: [
      'https://picsum.photos/id/621/800/1000',
      'https://picsum.photos/id/622/800/1000',
      'https://picsum.photos/id/623/800/1000'
    ],
    description: 'Vintage wash process. Drop shoulder silhouette. Ultra-soft cotton blend.',
    colors: ['Grey'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '4',
    name: 'CARGO PARACHUTE PANTS',
    price: 98000,
    category: 'Bottoms',
    collectionId: '1',
    image: 'https://picsum.photos/id/64/800/1000',
    images: [
      'https://picsum.photos/id/64/800/1000',
      'https://picsum.photos/id/65/800/1000',
      'https://picsum.photos/id/66/800/1000',
      'https://picsum.photos/id/67/800/1000',
      'https://picsum.photos/id/68/800/1000'
    ],
    description: 'Tech-wear inspired nylon fabric. Adjustable drawstrings at hem.',
    colors: ['Green'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '5',
    name: 'DISTRESSED KNIT BEANIE',
    price: 35000,
    category: 'Accessories',
    collectionId: '3',
    image: 'https://picsum.photos/id/823/800/1000',
    images: [
      'https://picsum.photos/id/823/800/1000'
    ],
    description: 'Hand-distressed detailing. One size fits all. Grunge aesthetic.',
    colors: ['Black'],
    sizes: ['One Size']
  },
  {
    id: '6',
    name: 'OVERSIZED GRAPHIC TEE',
    price: 65000,
    category: 'Tees',
    collectionId: '4', // Graphic Archive
    image: 'https://picsum.photos/id/177/800/1000',
    images: [
      'https://picsum.photos/id/177/800/1000',
      'https://picsum.photos/id/178/800/1000',
      'https://picsum.photos/id/179/800/1000'
    ],
    isNew: true,
    description: 'Heavyweight 240gsm cotton. Puff print graphic on back.',
    colors: ['Black'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '7',
    name: 'BONE STRUCTURE ZIP-UP',
    price: 125000,
    category: 'Hoodies',
    collectionId: '2',
    image: 'https://picsum.photos/id/91/800/1000',
    images: [
      'https://picsum.photos/id/91/800/1000',
      'https://picsum.photos/id/92/800/1000'
    ],
    description: 'Full zip hoodie with skeletal structural piping details.',
    colors: ['Black'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '8',
    name: 'TACTICAL VEST BLACK',
    price: 85000,
    category: 'Accessories',
    collectionId: '3',
    image: 'https://picsum.photos/id/433/800/1000',
    images: [
      'https://picsum.photos/id/433/800/1000',
      'https://picsum.photos/id/434/800/1000'
    ],
    description: 'Multi-pocket utility vest. Layering essential.',
    colors: ['Black'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '9',
    name: 'VINTAGE WASH TEE',
    price: 55000,
    category: 'Tees',
    collectionId: '4',
    image: 'https://picsum.photos/id/325/800/1000',
    description: 'Faded grey oversized tee with distressed edges.',
    colors: ['Grey'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '10',
    name: 'NYLON TRACK JACKET',
    price: 135000,
    category: 'Hoodies',
    collectionId: '2',
    image: 'https://picsum.photos/id/334/800/1000',
    description: 'Sporty oversized jacket with reflective piping.',
    colors: ['Blue'],
    sizes: ['M', 'L', 'XL']
  },
  {
    id: '11',
    name: 'PATCHWORK DENIM',
    price: 145000,
    category: 'Bottoms',
    collectionId: '1',
    image: 'https://picsum.photos/id/342/800/1000',
    isNew: true,
    description: 'Deconstructed denim with contrasting patches.',
    colors: ['Blue'],
    sizes: ['30', '32', '34', '36']
  },
  {
    id: '12',
    name: 'SILVER CHAIN CHOKER',
    price: 40000,
    category: 'Accessories',
    collectionId: '3',
    image: 'https://picsum.photos/id/349/800/1000',
    description: 'Chunky stainless steel link chain.',
    colors: ['Silver'],
    sizes: ['One Size']
  },
  {
    id: '13',
    name: 'MOTO RACING JACKET',
    price: 180000,
    category: 'Hoodies',
    collectionId: '3',
    image: 'https://picsum.photos/id/352/800/1000',
    isNew: true,
    description: 'Faux leather racing jacket with embroidered patches.',
    colors: ['Black'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '14',
    name: 'OVERSIZED SWEATPANTS',
    price: 85000,
    category: 'Bottoms',
    collectionId: '2',
    image: 'https://picsum.photos/id/355/800/1000',
    description: 'Ultra heavyweight fleece sweatpants.',
    colors: ['Grey'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '15',
    name: 'GRAFFITI PRINT TEE',
    price: 60000,
    category: 'Tees',
    collectionId: '4',
    image: 'https://picsum.photos/id/364/800/1000',
    description: 'All-over chaotic print on white cotton base.',
    colors: ['White'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '16',
    name: 'BUCKET HAT',
    price: 45000,
    category: 'Accessories',
    image: 'https://picsum.photos/id/366/800/1000',
    description: 'Deep fitting bucket hat with raw hem.',
    colors: ['Black'],
    sizes: ['One Size']
  },
  {
    id: '17',
    name: 'MESH TANK TOP',
    price: 35000,
    category: 'Tees',
    image: 'https://picsum.photos/id/399/800/1000',
    description: 'Layering mesh tank for summer fits.',
    colors: ['White'],
    sizes: ['S', 'M', 'L']
  },
  {
    id: '18',
    name: 'LEATHER CROSSBODY',
    price: 95000,
    category: 'Accessories',
    collectionId: '3',
    image: 'https://picsum.photos/id/403/800/1000',
    description: 'Compact daily carry bag with metal hardware.',
    colors: ['Black'],
    sizes: ['One Size']
  },
  {
    id: '19',
    name: 'NEON CITY WINDBREAKER',
    price: 130000,
    category: 'Hoodies',
    image: 'https://picsum.photos/id/412/800/1000',
    isNew: true,
    description: 'Lightweight tech fabric with neon accents.',
    colors: ['Black', 'Green'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '20',
    name: 'DISTRESSED CARGO SHORTS',
    price: 88000,
    category: 'Bottoms',
    collectionId: '1',
    image: 'https://picsum.photos/id/421/800/1000',
    description: 'Heavy duty cotton canvas shorts with raw hems.',
    colors: ['Green'],
    sizes: ['30', '32', '34', '36']
  },
  {
    id: '21',
    name: 'CYBER BEANIE',
    price: 38000,
    category: 'Accessories',
    image: 'https://picsum.photos/id/439/800/1000',
    description: 'Ribbed knit beanie with rubberized logo patch.',
    colors: ['Grey'],
    sizes: ['One Size']
  },
  {
    id: '22',
    name: 'OVERSIZED STRIPED TEE',
    price: 62000,
    category: 'Tees',
    collectionId: '4',
    image: 'https://picsum.photos/id/442/800/1000',
    description: 'Horizontal stripe pattern with boxy silhouette.',
    colors: ['Black', 'White'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '23',
    name: 'CHAIN REACTION NECKLACE',
    price: 42000,
    category: 'Accessories',
    collectionId: '3',
    image: 'https://picsum.photos/id/453/800/1000',
    isNew: true,
    description: 'Industrial style layered chain necklace.',
    colors: ['Silver'],
    sizes: ['One Size']
  },
  {
    id: '24',
    name: 'ACID WASH JOGGERS',
    price: 92000,
    category: 'Bottoms',
    collectionId: '1',
    image: 'https://picsum.photos/id/486/800/1000',
    description: 'Relaxed fit joggers with heavy acid wash treatment.',
    colors: ['Grey'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'test-sold-out',
    name: 'GHOST PROTOCOL HOODIE',
    price: 150000,
    category: 'Hoodies',
    collectionId: '2',
    image: 'https://picsum.photos/id/1060/800/1000',
    description: 'Extremely limited edition run. Completely sold out.',
    colors: ['Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: false
  },
  {
    id: 'test-limited',
    name: 'LIMITED EDITION TEE',
    price: 70000,
    category: 'Tees',
    collectionId: '4',
    image: 'https://picsum.photos/id/1059/800/1000',
    description: 'Running low on stock. Only small sizes remaining.',
    colors: ['White'],
    sizes: ['S', 'M', 'L', 'XL'],
    availableSizes: ['S', 'M']
  },
  {
    id: 'test-sale',
    name: 'VINTAGE FLAME TEE',
    price: 45000,
    originalPrice: 75000,
    category: 'Tees',
    collectionId: '4',
    image: 'https://picsum.photos/id/1067/800/1000',
    description: 'Classic fit tee with vintage flame graphic. Limited time offer.',
    colors: ['Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: false
  }
];

export const CATEGORIES = ['All', 'Hoodies', 'Bottoms', 'Tees', 'Accessories'];

export const COLLECTIONS: Collection[] = [
  {
    id: '1',
    title: 'The Denim Edit',
    subtitle: 'Heavyweight. Distressed. Essential.',
    image: 'https://picsum.photos/id/445/1200/800',
    size: 'large'
  },
  {
    id: '2',
    title: 'Oversized Hoodies',
    subtitle: 'Silhouette defining warmth.',
    image: 'https://picsum.photos/id/621/800/1000',
    size: 'medium'
  },
  {
    id: '3',
    title: 'Metal & Chrome',
    subtitle: 'Accessories to finish the fit.',
    image: 'https://picsum.photos/id/338/800/1000',
    size: 'medium'
  },
  {
    id: '4',
    title: 'Graphic Archive',
    subtitle: 'Statement tees for everyday chaos.',
    image: 'https://picsum.photos/id/177/1200/600',
    size: 'small'
  }
];

export const MOCK_USER: UserProfile = {
  id: 'u1',
  name: 'Mateo Valencia',
  email: 'mateo.v@example.com',
  phone: '+57 300 123 4567',
  address: 'Calle 10 # 5-23, Edificio Centro',
  city: 'Cúcuta, Norte de Santander',
  zip: '540001',
  joinDate: 'Jan 15, 2024'
};

export const MOCK_CUSTOMERS: UserProfile[] = [
  MOCK_USER,
  {
    id: 'u2',
    name: 'Sofia Ramirez',
    email: 'sofia.r@example.com',
    phone: '+57 312 987 6543',
    address: 'Av. 0 # 11-45',
    city: 'Bogotá, DC',
    zip: '110111',
    joinDate: 'Feb 10, 2024'
  },
  {
    id: 'u3',
    name: 'Carlos Mendez',
    email: 'carlos.m@example.com',
    phone: '+57 315 555 1234',
    address: 'Carrera 45 # 22-10',
    city: 'Medellín, Antioquia',
    zip: '050001',
    joinDate: 'Mar 05, 2024'
  },
  {
    id: 'u4',
    name: 'Valentina Lopez',
    email: 'valentina.l@example.com',
    phone: '+57 300 444 8888',
    address: 'Calle 50 # 10-20',
    city: 'Cali, Valle del Cauca',
    zip: '760001',
    joinDate: 'Mar 20, 2024'
  },
  {
    id: 'u5',
    name: 'Andres Garcia',
    email: 'andres.g@example.com',
    phone: '+57 320 111 2233',
    address: 'Transversal 15 # 4-30',
    city: 'Bucaramanga, Santander',
    zip: '680001',
    joinDate: 'Apr 02, 2024'
  },
  {
    id: 'u6',
    name: 'Isabella Torres',
    email: 'isabella.t@example.com',
    phone: '+57 310 777 9999',
    address: 'Diagonal 23 # 8-12',
    city: 'Cartagena, Bolívar',
    zip: '130001',
    joinDate: 'May 12, 2024'
  }
];

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
    ],
    customerEmail: 'mateo.v@example.com'
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
    ],
    customerEmail: 'mateo.v@example.com'
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
    ],
    customerEmail: 'sofia.r@example.com'
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
    ],
    customerEmail: 'carlos.m@example.com'
  }
];
