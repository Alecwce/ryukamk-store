/**
 * Represents a single item in the shopping cart.
 */
export interface CartItem {
  /** Unique identifier for the product */
  id: string;
  /** Name of the product */
  name: string;
  /** Price of the product in local currency */
  price: number;
  /** URL of the product image */
  image: string;
  /** Selected size variant */
  size: string;
  /** Selected color variant */
  color: string;
  /** Quantity of this item in the cart */
  quantity: number;
}

/**
 * State and actions for the Shopping Cart Store.
 */
export interface CartStore {
  /** List of items currently in the cart */
  items: CartItem[];
  /** Whether the cart drawer is open */
  isOpen: boolean;

  /**
   * Adds an item to the cart.
   * If the item already exists (same id, size, and color), increments its quantity.
   * Validates the item using Zod schema before adding.
   * @param item The item to add.
   */
  addItem: (item: CartItem) => void;

  /**
   * Removes an item from the cart by its unique composite ID.
   * @param uniqueId The composite ID (id-size-color) of the item to remove.
   */
  removeItem: (uniqueId: string) => void;

  /**
   * Updates the quantity of a specific item in the cart.
   * @param uniqueId The composite ID (id-size-color) of the item.
   * @param quantity The new quantity to set.
   */
  updateQuantity: (uniqueId: string, quantity: number) => void;

  /**
   * Toggles the visibility of the cart drawer.
   */
  toggleCart: () => void;

  /**
   * Removes all items from the cart.
   */
  clearCart: () => void;

  /**
   * Calculates the total price of all items in the cart.
   * @returns The total price.
   */
  getTotal: () => number;

  /**
   * Calculates the total number of items in the cart.
   * @returns The total count of items.
   */
  getItemCount: () => number;

  /**
   * Gets a summary of the cart including shipping and discounts.
   */
  getSummary: () => {
    subtotal: number;
    shipping: number;
    total: number;
  };
}
