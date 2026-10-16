export interface Product {
  id: number;
  name: {
    ua: string;
    en: string;
  };
  price: number;
  image_url: string;
  category: string;
  brand: string;
  country: string;
  characteristics: {
    cosmetic_classification?: string;
    skin_type?: string;
    purpose_and_result?: string;
    cleanser_type?: string;
    skin_problem?: string;
    age?: string;
    hypoallergenic?: string;
    volume?: string;
  };
  volume?: number;
  content: {
    description: string;
    usage: string;
    activeComponents: string;
    descriptionEn?: string;
    usageEn?: string;
    activeComponentsEn?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// TODO: backend removed — product data source not wired yet

export async function getAllProducts(): Promise<Product[]> {
  return [];
}

export async function getProductById(_id: string): Promise<Product | null> {
  return null;
}

export async function getRelatedProducts(
  _productId: number,
  _brand: string,
  _category: string,
  _limit: number = 4
): Promise<Product[]> {
  return [];
}

export async function getProductsWithFilters(_options: {
  search?: string;
  brand?: string;
  categories?: string[];
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'country';
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; total: number }> {
  return { products: [], total: 0 };
}
