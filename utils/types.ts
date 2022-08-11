export interface Money {
  amount: number;
  currency: string;
}

export interface Image {
  url: string;
  alt: string;
}

export interface List<T> {
  edges: T[];
}

export interface ProductPriceRange {
  start: { gross: Money };
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: {
    name: string;
  };
  thumbnail: Image | null;
  media: Image[];
  variants: ProductVariant[];
  pricing: {
    priceRange: ProductPriceRange;
  };
}

export interface ProductVariant {
  id: string;
  pricing: {
    price: {
      gross: Money;
    };
  };
  name: string;
  quantityAvailable: number;
}
