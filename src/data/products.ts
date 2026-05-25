import type { Product } from '../types';

export const PRODUCTS: Product[] = [
  { id: 'milk',          emoji: '🥛', name: 'Milk',           price: 5.00,   unit: 'gallon', initialStock: 48  },
  { id: 'eggs',          emoji: '🥚', name: 'Eggs',           price: 5.00,   unit: 'dozen',  initialStock: 36  },
  { id: 'ground-beef',   emoji: '🍔', name: 'Ground Beef',    price: 6.50,   unit: 'lb',     initialStock: 85  },
  { id: 'beef-steak',    emoji: '🥩', name: 'Beef Steak',     price: 14.00,  unit: 'lb',     initialStock: 22  },
  { id: 'beef-ribs',     emoji: '🍖', name: 'Beef Ribs',      price: 9.00,   unit: 'lb',     initialStock: 30  },
  { id: 'feeder-cattle', emoji: '🐄', name: 'Feeder Cattle',  price: 800.00, unit: 'head',   initialStock: 12  },
  { id: 'laying-hens',   emoji: '🐔', name: 'Laying Hens',    price: 25.00,  unit: 'each',   initialStock: 40  },
  { id: 'broiler',       emoji: '🍗', name: 'Broiler Chicken',price: 18.00,  unit: 'each',   initialStock: 14  },
  { id: 'chicks',        emoji: '🐣', name: 'Chicks',         price: 4.00,   unit: 'each',   initialStock: 60  },
  { id: 'butter',        emoji: '🧈', name: 'Butter',         price: 6.00,   unit: 'lb',     initialStock: 24  },
  { id: 'cheese',        emoji: '🧀', name: 'Cheese',         price: 8.00,   unit: 'lb',     initialStock: 18  },
  { id: 'bacon',         emoji: '🥓', name: 'Bacon',          price: 7.00,   unit: 'lb',     initialStock: 15  },
  { id: 'honey',         emoji: '🍯', name: 'Honey',          price: 12.00,  unit: 'jar',    initialStock: 9   },
  { id: 'corn',          emoji: '🌽', name: 'Sweet Corn',     price: 0.75,   unit: 'ear',    initialStock: 120 },
  { id: 'tomatoes',      emoji: '🍅', name: 'Tomatoes',       price: 3.50,   unit: 'lb',     initialStock: 42  },
];