export type MenuItem = {
  _id: string;
  name: string;
  categoryId: string | { _id: string; name: string };
  price: number;
  description: string;
  image?: {
    url: string;
    publicId: string;
  };
  isAvailable: boolean;
}