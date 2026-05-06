import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ProductDetailsCard from '../ui/ProductDetailsCard';
import type { Product } from '../types';

vi.mock('../ui/ProductCardImage', () => ({
  default: ({ product }: { product: Product }) => (
    <img data-testid="product-image" alt={product.name} src="mock.jpg" />
  ),
}));

vi.mock('../utils/cartHelpers', () => ({
  addItem: vi.fn(),
}));

import { addItem } from '../utils/cartHelpers';

const makeProduct = (overrides?: Partial<Product>): Product => ({
  _id: 'p1',
  name: 'Organic Tomato',
  description: 'Farm-fresh red tomatoes',
  price: 45,
  quantity: 20,
  sold: 3,
  shipping: true,
  category: { _id: 'c1', name: 'Vegetables' },
  ...overrides,
});

const renderCard = (product: Product) =>
  render(
    <MemoryRouter>
      <ProductDetailsCard product={product} />
    </MemoryRouter>
  );

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ProductDetailsCard', () => {
  it('returns null when product has no name', () => {
    const { container } = renderCard({ ...makeProduct(), name: '' });
    expect(container.firstChild).toBeNull();
  });

  it('renders the product name', () => {
    renderCard(makeProduct());
    expect(screen.getByText('Organic Tomato')).toBeInTheDocument();
  });

  it('renders the product price', () => {
    renderCard(makeProduct());
    expect(screen.getByText('₹45')).toBeInTheDocument();
  });

  it('renders the product description', () => {
    renderCard(makeProduct());
    expect(screen.getByText('Farm-fresh red tomatoes')).toBeInTheDocument();
  });

  it('renders the category name', () => {
    renderCard(makeProduct());
    expect(screen.getByText('Vegetables')).toBeInTheDocument();
  });

  it('does not render category when absent', () => {
    renderCard(makeProduct({ category: undefined }));
    expect(screen.queryByText('Vegetables')).not.toBeInTheDocument();
  });

  it('shows In Stock badge with quantity when quantity > 0', () => {
    renderCard(makeProduct({ quantity: 20 }));
    expect(screen.getByText('In Stock (20)')).toBeInTheDocument();
  });

  it('shows Out of Stock badge when quantity is 0', () => {
    renderCard(makeProduct({ quantity: 0 }));
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('shows Free Shipping badge when shipping is true', () => {
    renderCard(makeProduct({ shipping: true }));
    expect(screen.getByText(/Free Shipping/)).toBeInTheDocument();
  });

  it('does not show Free Shipping badge when shipping is false', () => {
    renderCard(makeProduct({ shipping: false }));
    expect(screen.queryByText(/Free Shipping/)).not.toBeInTheDocument();
  });

  it('Add to Cart button is enabled when in stock', () => {
    renderCard(makeProduct({ quantity: 5 }));
    expect(screen.getByRole('button', { name: /add to cart/i })).not.toBeDisabled();
  });

  it('Add to Cart button is disabled when out of stock', () => {
    renderCard(makeProduct({ quantity: 0 }));
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled();
  });

  it('calls addItem when Add to Cart is clicked', () => {
    renderCard(makeProduct());
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(addItem).toHaveBeenCalledWith(makeProduct(), expect.any(Function));
  });

  it('renders the product image', () => {
    renderCard(makeProduct());
    expect(screen.getByTestId('product-image')).toBeInTheDocument();
  });
});
