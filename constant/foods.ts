export type Food = {
  id: number;
  name: string;
  category: string;
  type: string; // You can make this more strict if you want: "Rice Meal" | "Snack" | "Cake" | "Ice Cream" | "Soft Drink" | "Juice" | "Smoothie"
  price: number;
  description: string;
  image: string;
};

export const foods = [
  {
    id: 1,
    name: "Jollof Rice and Chicken",
    category: "Meal",
    type: "Rice Meal",
    price: 2500,
    description: "Delicious Nigerian Jollof rice served with perfectly grilled chicken.",
    image: "/images/jollof-rice.jpg",
  },
  {
    id: 2,
    name: "Fried Rice and Turkey",
    category: "Meal",
    type: "Rice Meal",
    price: 3000,
    description: "Savory fried rice with tender turkey pieces, full of flavor.",
    image: "/images/fried-rice.jpg",
  },
  {
    id: 3,
    name: "Shawarma",
    category: "Appetizer",
    type: "Snack",
    price: 2000,
    description: "A tasty Middle Eastern wrap filled with seasoned meat and veggies.",
    image: "/images/shawarma.jpg",
  },
  {
    id: 4,
    name: "Spring Rolls",
    category: "Appetizer",
    type: "Snack",
    price: 1200,
    description: "Crispy rolls stuffed with fresh vegetables, perfect as a starter.",
    image: "/images/spring-rolls.jpg",
  },
  {
    id: 5,
    name: "Chocolate Cake",
    category: "Dessert",
    type: "Cake",
    price: 1800,
    description: "Rich and moist chocolate cake topped with smooth chocolate frosting.",
    image: "/images/chocolate-cake.jpg",
  },
  {
    id: 6,
    name: "Ice Cream (Vanilla)",
    category: "Dessert",
    type: "Ice Cream",
    price: 1500,
    description: "Classic creamy vanilla ice cream to cool you down.",
    image: "/images/ice-cream.jpg",
  },
  {
    id: 7,
    name: "Coca-Cola",
    category: "Drink",
    type: "Soft Drink",
    price: 500,
    description: "Refreshing and fizzy Coca-Cola, perfect with any meal.",
    image: "/images/coke.jpg",
  },
  {
    id: 8,
    name: "Fresh Orange Juice",
    category: "Drink",
    type: "Juice",
    price: 1500,
    description: "Cold-pressed fresh orange juice, full of vitamin C.",
    image: "/images/orange-juice.jpg",
  },
  {
    id: 9,
    name: "Smoothie (Strawberry)",
    category: "Drink",
    type: "Smoothie",
    price: 2000,
    description: "Thick and creamy strawberry smoothie made with fresh strawberries.",
    image: "/images/smoothie.jpg",
  },
];
