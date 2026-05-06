import { describe, it, expect, beforeEach } from 'vitest';
import {
  addItem,
  removeItem,
  updateItem,
  getCart,
  itemTotal,
  emptyCart,
} from '../utils/cartHelpers';
import type { Product } from '../types';

const makeProduct = (overrides?: Partial<Product>): Product => ({
  _id: 'p1',
  name: 'Tomato',
  description: 'Fresh tomato',
  price: 30,
  quantity: 10,
  sold: 5,
  shipping: true,
  ...overrides,
});

beforeEach(() => {
  localStorage.clear();
});

describe('addItem', () => {
  it('adds an item to an empty cart', () => {
    const product = makeProduct();
    addItem(product, () => {});
    expect(getCart()).toHaveLength(1);
    expect(getCart()[0]._id).toBe('p1');
  });

  it('sets count to 1 on add', () => {
    addItem(makeProduct(), () => {});
    expect(getCart()[0].count).toBe(1);
  });

  it('calls the callback after adding', () => {
    let called = false;
    addItem(makeProduct(), () => { called = true; });
    expect(called).toBe(true);
  });

  it('deduplicates items with the same _id', () => {
    const product = makeProduct();
    addItem(product, () => {});
    addItem(product, () => {});
    expect(getCart()).toHaveLength(1);
  });

  it('adds multiple distinct products', () => {
    addItem(makeProduct({ _id: 'p1' }), () => {});
    addItem(makeProduct({ _id: 'p2', name: 'Carrot' }), () => {});
    expect(getCart()).toHaveLength(2);
  });
});

describe('removeItem', () => {
  it('removes a product from the cart by id', () => {
    addItem(makeProduct({ _id: 'p1' }), () => {});
    addItem(makeProduct({ _id: 'p2', name: 'Carrot' }), () => {});
    removeItem('p1');
    const cart = getCart();
    expect(cart).toHaveLength(1);
    expect(cart[0]._id).toBe('p2');
  });

  it('returns remaining cart items', () => {
    addItem(makeProduct({ _id: 'p1' }), () => {});
    const remaining = removeItem('p1');
    expect(remaining).toHaveLength(0);
  });

  it('does nothing when id is not found', () => {
    addItem(makeProduct(), () => {});
    removeItem('nonexistent');
    expect(getCart()).toHaveLength(1);
  });
});

describe('updateItem', () => {
  it('updates the count of a cart item', () => {
    addItem(makeProduct({ _id: 'p1' }), () => {});
    updateItem('p1', 5);
    expect(getCart()[0].count).toBe(5);
  });

  it('only updates the matching product', () => {
    addItem(makeProduct({ _id: 'p1' }), () => {});
    addItem(makeProduct({ _id: 'p2', name: 'Carrot' }), () => {});
    updateItem('p1', 3);
    const cart = getCart();
    expect(cart.find(p => p._id === 'p1')?.count).toBe(3);
    expect(cart.find(p => p._id === 'p2')?.count).toBe(1);
  });
});

describe('getCart', () => {
  it('returns an empty array when cart is empty', () => {
    expect(getCart()).toEqual([]);
  });

  it('returns all items in the cart', () => {
    addItem(makeProduct({ _id: 'p1' }), () => {});
    addItem(makeProduct({ _id: 'p2', name: 'Carrot' }), () => {});
    expect(getCart()).toHaveLength(2);
  });
});

describe('itemTotal', () => {
  it('returns 0 when cart is empty', () => {
    expect(itemTotal()).toBe(0);
  });

  it('returns the number of items in cart', () => {
    addItem(makeProduct({ _id: 'p1' }), () => {});
    addItem(makeProduct({ _id: 'p2', name: 'Carrot' }), () => {});
    expect(itemTotal()).toBe(2);
  });
});

describe('emptyCart', () => {
  it('clears all items from the cart', () => {
    addItem(makeProduct(), () => {});
    emptyCart(() => {});
    expect(getCart()).toEqual([]);
    expect(itemTotal()).toBe(0);
  });

  it('calls the callback after clearing', () => {
    let called = false;
    emptyCart(() => { called = true; });
    expect(called).toBe(true);
  });
});
