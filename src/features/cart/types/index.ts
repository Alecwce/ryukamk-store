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
