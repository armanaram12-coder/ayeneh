export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "فروشگاه آینه",
    "alternateName": ["Ayeneh", "Ayeneh Shop", "آینه شاپ"],
    "description": "فروشگاه اینترنتی آینه، مرجع تخصصی محصولات آرایشی بهداشتی و نمایندگی رسمی برند تراست (Trust) در ایران",
    "url": "https://ayeneh.vercel.app",
    "telephone": "+989352225693",
    "email": "ayenehshop@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "یوسف آباد، بالاتر از میدان جمال الدین اسد آبادی، نبش کوچه ۳۹، پلاک ۳۴۹، ساختمان کاج، طبقه دوم، واحد ۳",
      "addressLocality": "تهران",
      "addressCountry": "IR"
    },
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "سرم تراست",
          "brand": { "@type": "Brand", "name": "Trust" }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "کرم تراست",
          "brand": { "@type": "Brand", "name": "Trust" }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "ضد آفتاب تراست",
          "brand": { "@type": "Brand", "name": "Trust" }
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
