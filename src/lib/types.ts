export const PRODUCT_TYPES = ["MAGNET_SMALL", "MAGNET_LARGE", "EVENT_CARD"] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  MAGNET_SMALL: "Small Magnet",
  MAGNET_LARGE: "Large Magnet",
  EVENT_CARD: "Event Card",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const PAYMENT_METHODS = ["COD", "INSTAPAY"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  COD: "Cash on Delivery",
  INSTAPAY: "InstaPay",
};

export interface EventCardText {
  names?: string;
  eventDate?: string;
  message?: string;
}

export interface CartItem {
  key: string;
  kind: "product" | "package";
  id: string;
  slug: string;
  name: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  compareAtPrice?: number | null;
  imageUrl: string;
  uploadedImageUrls: string[];
  customText?: EventCardText;
}
