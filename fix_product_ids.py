import json

# خواندن فایل JSON
with open('src/data/products.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# افزایش تمام IDها به میزان 1
for category in data['categories']:
    for subcategory in category['subcategories']:
        for product in subcategory['products']:
            old_id = product['id']
            product['id'] = old_id + 1
            print(f"Product {old_id} -> {product['id']}: {product['name']}")

# ذخیره فایل با تغییرات
with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\n✅ تمام IDها با موفقیت +1 شدند!")
print("حالا فایل products.json را commit و push کن.")
