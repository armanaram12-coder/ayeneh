import json

# Load existing data
with open('src/data/products.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Add Serums Category
serum_category = {
    "id": 2,
    "name": "سرم تخصصی",
    "subcategories": [
        {
            "id": 21,
            "name": "سرم تخصصی صورت",
            "products": [
                {"id": 31, "name": "سرم آبرسان پوست هیالورونیک اسید تراست", "brand": "تراست", "gender": "یونیسکس", "type": "سرم", "volume_ml": 20, "price_toman": 737000, "stock": 10, "sku": "TRUST-SERUM-HYALURONIC-20ML"},
                {"id": 32, "name": "سرم روشن کننده تراست", "brand": "تراست", "gender": "یونیسکس", "type": "سرم", "volume_ml": 20, "price_toman": 737000, "stock": 10, "sku": "TRUST-SERUM-BRIGHTENING-20ML"},
                {"id": 33, "name": "سرم ویتامین سی تراست", "brand": "تراست", "gender": "یونیسکس", "type": "سرم", "volume_ml": 20, "price_toman": 737000, "stock": 10, "sku": "TRUST-SERUM-VITAMINC-20ML"},
                {"id": 34, "name": "سرم لایه‌بردار قوی تراست حاوی 20% AHA", "brand": "تراست", "gender": "یونیسکس", "type": "سرم", "volume_ml": 50, "price_toman": 737000, "stock": 10, "sku": "TRUST-SERUM-AHA20-50ML"},
                {"id": 35, "name": "سرم جوانساز رتینول تراست", "brand": "تراست", "gender": "یونیسکس", "type": "سرم", "volume_ml": 20, "price_toman": 837000, "stock": 10, "sku": "TRUST-SERUM-RETINOL-20ML"},
                {"id": 36, "name": "سرم جوانساز کلاژن تراست", "brand": "تراست", "gender": "یونیسکس", "type": "سرم", "volume_ml": 20, "price_toman": 837000, "stock": 10, "sku": "TRUST-SERUM-COLLAGEN-20ML"},
                {"id": 37, "name": "سرم ضدچروک دور چشم تراست", "brand": "تراست", "gender": "یونیسکس", "type": "سرم", "volume_ml": 20, "price_toman": 747000, "stock": 10, "sku": "TRUST-SERUM-EYE-20ML"},
                {"id": 38, "name": "سرم آبرسان عمیق پوست تراست اسمارت", "brand": "تراست اسمارت", "gender": "یونیسکس", "type": "سرم", "volume_ml": 15, "price_toman": 1297000, "stock": 10, "sku": "TRUST-SMART-SERUM-HYDRA-15ML"},
                {"id": 39, "name": "سرم لایه بردار تراست اسمارت", "brand": "تراست اسمارت", "gender": "یونیسکس", "type": "سرم", "volume_ml": 15, "price_toman": 1297000, "stock": 10, "sku": "TRUST-SMART-SERUM-PEEL-15ML"},
                {"id": 40, "name": "سرم ویتامین سی تراست اسمارت", "brand": "تراست اسمارت", "gender": "یونیسکس", "type": "سرم", "volume_ml": 15, "price_toman": 1297000, "stock": 10, "sku": "TRUST-SMART-SERUM-VITC-15ML"},
                {"id": 41, "name": "سرم ضد لک و روشن کننده پوست تراست اسمارت", "brand": "تراست اسمارت", "gender": "یونیسکس", "type": "سرم", "volume_ml": 15, "price_toman": 0, "stock": 0, "status": "ناموجود", "sku": "TRUST-SMART-SERUM-PIGMENT-15ML"},
                {"id": 42, "name": "سرم جوانساز، لیفت و ضدچروک تراست اسمارت", "brand": "تراست اسمارت", "gender": "یونیسکس", "type": "سرم", "volume_ml": 15, "price_toman": 1479000, "stock": 10, "sku": "TRUST-SMART-SERUM-LIFT-15ML"},
                {"id": 43, "name": "سرم سه گانه هوشمند تراست اسمارت", "brand": "تراست اسمارت", "gender": "یونیسکس", "type": "سرم", "volume_ml": 60, "price_toman": 4479000, "stock": 10, "sku": "TRUST-SMART-SERUM-TRIPLE-60ML"}
            ]
        },
        {
            "id": 22,
            "name": "سرم تخصصی مو",
            "products": [
                {"id": 44, "name": "سرم کراتین و آرگان", "brand": "تراست", "gender": "یونیسکس", "type": "سرم مو", "volume_ml": 50, "price_toman": 747000, "stock": 10, "sku": "TRUST-SERUM-HAIR-KERATIN-50ML"},
                {"id": 45, "name": "سرم موی بیوتین بپانتین", "brand": "تراست", "gender": "یونیسکس", "type": "سرم مو", "volume_ml": 15, "price_toman": 1279000, "stock": 10, "sku": "TRUST-SERUM-HAIR-BIOTIN-15ML"},
                {"id": 46, "name": "سرم بهبود دهنده ریزش سکه ای مو", "brand": "تراست", "gender": "یونیسکس", "type": "سرم مو", "volume_ml": 15, "volume_unit": "گرم", "price_toman": 1170000, "stock": 10, "sku": "TRUST-SERUM-HAIR-ALOPECIA-15G"},
                {"id": 47, "name": "سرم آنتی پسوریازیس", "brand": "تراست", "gender": "یونیسکس", "type": "سرم مو", "volume_ml": 15, "volume_unit": "گرم", "price_toman": 1297000, "stock": 10, "sku": "TRUST-SERUM-HAIR-PSORIASIS-15G"},
                {"id": 48, "name": "لوسیون اسکراب کف سر تراست", "brand": "تراست", "gender": "یونیسکس", "type": "اسکراب کف سر", "volume_ml": 120, "price_toman": 1390000, "stock": 10, "sku": "TRUST-SERUM-HAIR-SCRUB-120ML"}
            ]
        },
        {
            "id": 23,
            "name": "سرم تخصصی بدن",
            "products": [
                {"id": 49, "name": "سرم ترمیم و تقویت ناخن تراست", "brand": "تراست", "gender": "یونیسکس", "type": "سرم ناخن", "volume_ml": 3, "price_toman": 977000, "stock": 10, "sku": "TRUST-SERUM-NAIL-3ML"}
            ]
        },
        {
            "id": 24,
            "name": "سرم تخصصی ناحیه چشم",
            "products": [
                {"id": 50, "name": "ژل لیفت ابرو تراست", "brand": "تراست", "gender": "یونیسکس", "type": "ژل ابرو", "volume_ml": 15, "price_toman": 597000, "stock": 10, "sku": "TRUST-SERUM-EYEBROW-LIFT-15ML"},
                {"id": 51, "name": "سرم تقویت مژه تراست", "brand": "تراست", "gender": "یونیسکس", "type": "سرم مژه", "volume_ml": 10, "price_toman": 1397000, "stock": 10, "sku": "TRUST-SERUM-EYELASH-10ML"},
                {"id": 52, "name": "سرم جوانساز، لیفت و ضد چروک دور چشم تراست اسمارت", "brand": "تراست اسمارت", "gender": "یونیسکس", "type": "سرم دور چشم", "volume_ml": 15, "price_toman": 1479000, "stock": 10, "sku": "TRUST-SMART-SERUM-EYE-15ML"},
                {"id": 53, "name": "سرم رویش و تقویت ابرو تراست", "brand": "تراست", "gender": "یونیسکس", "type": "سرم ابرو", "volume_ml": 15, "price_toman": 1297000, "stock": 10, "sku": "TRUST-SERUM-EYEBROW-15ML"}
            ]
        }
    ]
}

data["categories"].append(serum_category)

# Update total products count
total = sum(len(sub["products"]) for cat in data["categories"] for sub in cat["subcategories"])
data["total_products"] = total

# Save back
with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ Serums added! Total products now: {total}")
