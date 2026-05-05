import { useState, useMemo } from 'react';
import { CATALOG_PRODUCTS, ProductFilter } from '@/data/products';
import { CatalogProduct } from '@/shared/types';

export function useCatalog() {
  const [filter, setFilter] = useState<ProductFilter>('all');

  const products = useMemo<CatalogProduct[]>(() => {
    if (filter === 'all') return CATALOG_PRODUCTS;
    return CATALOG_PRODUCTS.filter((p) => p.category === filter);
  }, [filter]);

  return { products, filter, setFilter };
}
