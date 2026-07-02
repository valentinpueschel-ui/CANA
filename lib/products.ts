export type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  alt: string;
  /** gallery images for the quick-view modal (first is the card/hero image) */
  gallery: string[];
  shortLine: string;
  description: string;
  /** short materials & care line shown in the quick-view modal */
  materialsCare: string;
  verse?: string;
  reference?: string;
  /** mark the lead product for emphasis */
  lead?: boolean;
  /** Shopify Buy Button product id */
  shopifyId?: string;
  /** unique mount-div id for a Shopify buy button rendered on the product card */
  shopifyDomId?: string;
};

/** Card order on the page: Gift Set, Mug, Blessing Dish, Cana Light. */
export const products: Product[] = [
  {
    id: "giftset",
    name: 'The "Be Still" Gift Set',
    price: "$78",
    image: "/images/giftset.webp",
    alt: "The Be Still gift set — ivory stoneware mug and dish nestled in a bone gift box with a blessing card.",
    gallery: [
      "/images/giftset.webp",
      "/images/box.webp",
      "/images/card.webp",
      "/images/giftset-card.webp",
    ],
    shopifyId: "16367718629721",
    shopifyDomId: "product-component-1782321651469",
    shortLine: "The whole table, ready to give.",
    description:
      "Our founding gift — the Be Still mug and the Lord-bless-you dish, nestled in a bone gift box with a blessing card. Made to be opened slowly and kept for years.",
    materialsCare:
      "Warm ivory stoneware, soft matte finish. Arrives gift-boxed with a blessing card; dishwasher-safe, though we'd hand-wash to keep it lovely.",
    lead: true,
  },
  {
    id: "mug",
    name: "Be Still Mug",
    price: "$38",
    image: "/images/mug.webp",
    alt: "Warm ivory stoneware mug with 'Be still, and know' carved into the clay, tone on tone.",
    gallery: ["/images/mug.webp", "/images/mug-box.webp", "/images/mug-card.webp"],
    shopifyId: "16366390542681",
    shopifyDomId: "shopify-buy-mug-card",
    shortLine: "For the quiet of the morning.",
    description:
      "Warm ivory stoneware with the words carved into the clay, tone-on-tone — felt as much as read. A daily reminder in your hands.",
    materialsCare:
      "Warm ivory stoneware with a soft matte finish and a raw, unglazed clay foot. Dishwasher-safe; hand-wash to keep it lovely for years.",
    verse: "Be still, and know",
    reference: "Psalm 46:10",
  },
  {
    id: "dish",
    name: "Blessing Dish",
    price: "$20",
    image: "/images/dish.webp",
    alt: "Small hand-formed ivory stoneware dish with 'The Lord bless you and keep you' carved into the clay.",
    gallery: ["/images/dish.webp", "/images/dish-box.webp", "/images/dish-card.webp"],
    shopifyId: "16367712928089",
    shopifyDomId: "product-component-1782321587025",
    shortLine: "A blessing by the door, by the sink, by the bed.",
    description:
      "A small hand-formed dish for rings, keys, or a quiet moment — carrying the oldest blessing in Scripture.",
    materialsCare:
      "Hand-formed ivory stoneware, soft matte finish, raw unglazed foot. Rinse or wipe clean.",
    verse: "The Lord bless you and keep you",
    reference: "Numbers 6:24",
  },
  {
    id: "luminary",
    name: "Cana Light",
    price: "$68",
    image: "/images/luminary.webp",
    alt: "Pierced stoneware luminary casting a soft cross of candlelight across an evening table.",
    gallery: ["/images/luminary.webp", "/images/luminary-box.webp", "/images/luminary-card.webp"],
    shopifyId: "16367715418457",
    shopifyDomId: "product-component-1782321624389",
    shortLine: "A cross of candlelight on the evening table.",
    description:
      "A pierced stoneware luminary. Set a tea light inside and the verse glows; a soft cross of light falls across the table at dusk.",
    materialsCare:
      "Pierced ivory stoneware with a soft matte finish. Use a standard tea light; wipe clean.",
    verse: "The Lord is my light",
    reference: "Psalm 27:1",
  },
];
