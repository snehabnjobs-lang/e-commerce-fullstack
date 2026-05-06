import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ProductCardSkeleton, { ProductGridSkeleton } from '../ui/ProductCardSkeleton';

describe('ProductCardSkeleton', () => {
  it('renders the skeleton card structure', () => {
    const { container } = render(<ProductCardSkeleton />);
    expect(container.querySelector('.skeleton-card')).toBeInTheDocument();
    expect(container.querySelector('.skeleton-img')).toBeInTheDocument();
    expect(container.querySelector('.skeleton-body')).toBeInTheDocument();
  });

  it('renders skeleton lines', () => {
    const { container } = render(<ProductCardSkeleton />);
    const lines = container.querySelectorAll('.skeleton-line');
    expect(lines.length).toBeGreaterThan(0);
  });

  it('renders skeleton footer with pill and button', () => {
    const { container } = render(<ProductCardSkeleton />);
    expect(container.querySelector('.skeleton-pill')).toBeInTheDocument();
    expect(container.querySelector('.skeleton-btn')).toBeInTheDocument();
  });
});

describe('ProductGridSkeleton', () => {
  it('renders 8 skeleton cards by default', () => {
    const { container } = render(<ProductGridSkeleton />);
    expect(container.querySelectorAll('.skeleton-card')).toHaveLength(8);
  });

  it('renders the specified number of cards', () => {
    const { container } = render(<ProductGridSkeleton count={3} />);
    expect(container.querySelectorAll('.skeleton-card')).toHaveLength(3);
  });

  it('renders inside a product-grid wrapper', () => {
    const { container } = render(<ProductGridSkeleton count={2} />);
    expect(container.querySelector('.product-grid')).toBeInTheDocument();
  });
});
