export type WishItem = {
  id: string;
  title: string;
  comment: string;
};

export function parseWishlist(wishlistStr: string | null | undefined): WishItem[] {
  if (!wishlistStr) return [];
  
  try {
    const parsed = JSON.parse(wishlistStr);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    // If it fails to parse, it's likely an old plain-text wishlist.
    // Convert it to a single item.
    return [
      {
        id: crypto.randomUUID(),
        title: wishlistStr,
        comment: "",
      }
    ];
  }
}

export function stringifyWishlist(items: WishItem[]): string {
  return JSON.stringify(items);
}
