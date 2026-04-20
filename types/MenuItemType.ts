export type MenuItem = {
  _id?: string;
  name: string;
  categoryId: string | { _id: string; name: string };
  price: string;
  description: string;
  image: string;
  isAvailable: boolean;
}