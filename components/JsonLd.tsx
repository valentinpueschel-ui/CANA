import { products } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

/**
 * Organization + WebSite + Product structured data (JSON-LD) so the four priced
 * pre-order pieces are eligible for rich results and the brand is machine-legible.
 */
export function JsonLd() {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Cana",
      url: SITE_URL,
      logo: `${SITE_URL}/apple-touch-icon.png`,
      description: "Heirloom ceramics for the Christian home — Scripture carved into the clay.",
      email: "hello@canaceramics.com",
      sameAs: ["https://instagram.com", "https://facebook.com"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Cana",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    ...products.map((p) => ({
      "@type": "Product",
      name: p.name,
      description: p.description,
      image: `${SITE_URL}${p.image}`,
      brand: { "@type": "Brand", name: "Cana" },
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: String(Number(p.price.replace(/[^0-9.]/g, "")) || ""),
        availability: "https://schema.org/PreOrder",
        url: `${SITE_URL}/#pieces`,
      },
    })),
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
