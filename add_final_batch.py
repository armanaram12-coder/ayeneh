import json

with open('src/data/products.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Category 11: روغن و لوسیون
cat11 = {
    "id": 11, "name": "روغن و لوسیون",
    "subcategories": [
        {"id": 111, "name": "روغن مو", "products": [
            {"id": 183, "name": "روغن آرگان مو", "brand": "تراست", "gender": "یونیسکس", "type": "روغن مو", "volume_ml": 50, "price_toman": 797000, "stock": 10, "sku": "TRUST-OIL-ARGAN-HAIR-50ML"},
            {"id": 184, "name": "روغن تقویت ریش آقایان تراست", "brand": "تراست", "gender": "مردانه", "type": "روغن ریش", "volume_ml": 30, "price_toman": 579000, "stock": 10, "sku": "TRUST-OIL-BEARD-30ML"}
        ]},
        {"id": 112, "name": "روغن بدن", "products": [
            {"id": 185, "name": "روغن شترمرغ", "brand": "تراست", "gender": "یونیسکس", "type": "روغن بدن", "volume_ml": 120, "price_toman": 747000, "stock": 10, "sku": "TRUST-OIL-OSTRICH-BODY-120ML"},
            {"id": 186, "name": "روغن آرگان پوست", "brand": "تراست", "gender": "یونیسکس", "type": "روغن بدن", "volume_ml": 50, "price_toman": 797000, "stock": 10, "sku": "TRUST-OIL-ARGAN-BODY-50ML"}
        ]},
        {"id": 113, "name": "لوسیون", "products": [
            {"id": 187, "name": "لوسیون ضد درد و گرفتگی عضلات", "brand": "تراست", "gender": "یونیسکس", "type": "لوسیون بدن", "volume_ml": 150, "price_toman": 0, "stock": 0, "status": "ناموجود", "sku": "TRUST-LOTION-PAINKILLER-150ML"},
            {"id": 188, "name": "لوسیون چربی سوز", "brand": "تراست", "gender": "یونیسکس", "type": "لوسیون بدن", "volume_ml": 150, "price_toman": 1947000, "stock": 10, "sku": "TRUST-LOTION-SLIM-150ML"},
            {"id": 189, "name": "لوسیون آنتی سلولیت", "brand": "تراست", "gender": "یونیسکس", "type": "لوسیون بدن", "volume_ml": 150, "price_toman": 1947000, "stock": 10, "sku": "TRUST-LOTION-ANTICELLULITE-150ML"},
            {"id": 190, "name": "لوسیون چربی سوز تیوبی (شارژ)", "brand": "تراست", "gender": "یونیسکس", "type": "شارژ لوسیون", "volume_ml": 150, "price_toman": 1470000, "stock": 10, "sku": "TRUST-LOTION-SLIM-REFILL-150ML"},
            {"id": 191, "name": "لوسیون ضد درد تیوبی (شارژ)", "brand": "تراست", "gender": "یونیسکس", "type": "شارژ لوسیون", "volume_ml": 150, "price_toman": 1370000, "stock": 10, "sku": "TRUST-LOTION-PAINKILLER-REFILL-150ML"}
        ]}
    ]
}

data["categories"].append(cat11)

total = sum(len(sub["products"]) for cat in data["categories"] for sub in cat["subcategories"])
data["total_products"] = total

with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ ALL CATEGORIES ADDED! Total products: {total}")
print(f"Total categories: {len(data['categories'])}")
