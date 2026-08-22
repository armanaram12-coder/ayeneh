import json

with open('src/data/products.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Category 7: آرایشی
cat7 = {
    "id": 7, "name": "آرایشی",
    "subcategories": [
        {"id": 71, "name": "ریمل", "products": [
            {"id": 124, "name": "ریمل حجم دهنده سرژه", "brand": "سرژه", "gender": "زنانه", "type": "ریمل مژه", "volume_ml": 15, "color": "مشکی", "price_toman": 747000, "stock": 10, "sku": "SERJE-MASCARA-VOLUME-15ML"},
            {"id": 125, "name": "ریمل لیفت کننده سرژه", "brand": "سرژه", "gender": "زنانه", "type": "ریمل مژه", "volume_ml": 15, "color": "مشکی", "price_toman": 747000, "stock": 10, "sku": "SERJE-MASCARA-LIFT-15ML"},
            {"id": 126, "name": "ریمل قهوه‌ای حجم دهنده مژه سرژه", "brand": "سرژه", "gender": "زنانه", "type": "ریمل مژه", "volume_ml": 15, "color": "قهوه‌ای", "price_toman": 747000, "stock": 10, "sku": "SERJE-MASCARA-BROWN-15ML"},
            {"id": 127, "name": "ریمل ابرو مشکی سرژه", "brand": "سرژه", "gender": "زنانه", "type": "ریمل ابرو", "volume_ml": 5, "color": "مشکی", "price_toman": 879000, "stock": 10, "sku": "SERJE-EYEBROW-BLACK-5ML"},
            {"id": 128, "name": "ریمل ابرو قهوه‌ای سرژه", "brand": "سرژه", "gender": "زنانه", "type": "ریمل ابرو", "volume_ml": 5, "color": "قهوه‌ای", "price_toman": 879000, "stock": 10, "sku": "SERJE-EYEBROW-BROWN-5ML"}
        ]},
        {"id": 72, "name": "کانسیلر", "products": [
            {"id": 129, "name": "کانسیلر سرژه", "brand": "سرژه", "gender": "زنانه", "type": "کانسیلر", "price_toman": 0, "stock": 0, "status": "ناموجود", "sku": "SERJE-CONCEALER-PLACEHOLDER"}
        ]},
        {"id": 73, "name": "خط چشم", "products": [
            {"id": 130, "name": "خط چشم ماژیکی مشکی سرژه", "brand": "سرژه", "gender": "زنانه", "type": "خط چشم", "volume_ml": 1, "color": "مشکی", "price_toman": 479000, "stock": 10, "sku": "SERJE-EYELINER-LIQUID-BLACK-1ML"}
        ]},
        {"id": 74, "name": "کرم CC", "products": [
            {"id": 131, "name": "سی سی کرم پلاس تراست شماره ۱ (بژ روشن)", "brand": "تراست", "gender": "زنانه", "type": "کرم CC", "volume_ml": 30, "color": "Light Beige", "spf": 30, "price_toman": 549000, "stock": 10, "sku": "TRUST-CC-LIGHT-BEIGE-30ML"},
            {"id": 132, "name": "سی سی کرم پلاس تراست شماره ۲ (بژ طبیعی)", "brand": "تراست", "gender": "زنانه", "type": "کرم CC", "volume_ml": 30, "color": "Natural Beige", "spf": 30, "price_toman": 549000, "stock": 10, "sku": "TRUST-CC-NATURAL-BEIGE-30ML"},
            {"id": 133, "name": "سی سی کرم پلاس تراست شماره ۳ (بژ تیره)", "brand": "تراست", "gender": "زنانه", "type": "کرم CC", "volume_ml": 30, "color": "Dark Beige", "spf": 30, "price_toman": 549000, "stock": 10, "sku": "TRUST-CC-DARK-BEIGE-30ML"}
        ]},
        {"id": 75, "name": "کرم DD", "products": [
            {"id": 134, "name": "دی دی کرم پلاس تراست شماره ۱ (بژ روشن)", "brand": "تراست", "gender": "زنانه", "type": "کرم DD", "volume_ml": 30, "color": "Light Beige", "spf": 30, "price_toman": 579000, "stock": 10, "sku": "TRUST-DD-LIGHT-BEIGE-30ML"},
            {"id": 135, "name": "دی دی کرم پلاس تراست شماره ۲ (بژ طبیعی)", "brand": "تراست", "gender": "زنانه", "type": "کرم DD", "volume_ml": 30, "color": "Natural Beige", "spf": 30, "price_toman": 579000, "stock": 10, "sku": "TRUST-DD-NATURAL-BEIGE-30ML"},
            {"id": 136, "name": "دی دی کرم پلاس تراست شماره ۳ (بژ تیره)", "brand": "تراست", "gender": "زنانه", "type": "کرم DD", "volume_ml": 30, "color": "Dark Beige", "spf": 30, "price_toman": 579000, "stock": 10, "sku": "TRUST-DD-DARK-BEIGE-30ML"}
        ]},
        {"id": 76, "name": "کرم BB", "products": [
            {"id": 137, "name": "بی بی کرم پلاس تراست شماره  (بژ روشن)", "brand": "تراست", "gender": "زنانه", "type": "کرم BB", "volume_ml": 30, "color": "Light Beige", "spf": 30, "price_toman": 477000, "stock": 10, "sku": "TRUST-BB-LIGHT-BEIGE-30ML"},
            {"id": 138, "name": "بی بی کرم پلاس تراست شماره ۲ (بژ طبیعی)", "brand": "تراست", "gender": "زنانه", "type": "کرم BB", "volume_ml": 30, "color": "Natural Beige", "spf": 30, "price_toman": 477000, "stock": 10, "sku": "TRUST-BB-NATURAL-BEIGE-30ML"},
            {"id": 139, "name": "بی بی کرم پلاس تراست شماره ۳ (بژ تیره)", "brand": "تراست", "gender": "زنانه", "type": "کرم BB", "volume_ml": 30, "color": "Dark Beige", "spf": 30, "price_toman": 477000, "stock": 10, "sku": "TRUST-BB-DARK-BEIGE-30ML"}
        ]},
        {"id": 77, "name": "رژ لب", "products": [
            {"id": 140, "name": "رژ لب مایع مخملی مات سرژه کد ۱۰۱", "brand": "سرژه", "gender": "زنانه", "type": "رژ لب مات", "volume_ml": 10, "color": "Red Classic", "price_toman": 977000, "stock": 10, "sku": "SERJE-LIPSTICK-MATTE-101-10ML"},
            {"id": 141, "name": "رژ لب مایع مخملی مات سرژه کد ۰۲", "brand": "سرژه", "gender": "زنانه", "type": "رژ لب مات", "volume_ml": 10, "color": "Plum Persian", "price_toman": 977000, "stock": 10, "sku": "SERJE-LIPSTICK-MATTE-102-10ML"},
            {"id": 142, "name": "رژ لب مایع مخملی مات سرژه کد ۱۰۳", "brand": "سرژه", "gender": "زنانه", "type": "رژ لب مات", "volume_ml": 10, "color": "Nude Pink", "price_toman": 977000, "stock": 10, "sku": "SERJE-LIPSTICK-MATTE-103-10ML"},
            {"id": 143, "name": "رژ لب مایع مخملی مات سرژه کد ۱۰۴", "brand": "سرژه", "gender": "زنانه", "type": "رژ لب مات", "volume_ml": 10, "color": "Brownish Nude", "price_toman": 977000, "stock": 10, "sku": "SERJE-LIPSTICK-MATTE-104-10ML"},
            {"id": 144, "name": "رژ لب مایع مخملی مات سرژه کد ۱۰۵", "brand": "سرژه", "gender": "زنانه", "type": "رژ لب مات", "volume_ml": 10, "color": "Red Mauve", "price_toman": 977000, "stock": 10, "sku": "SERJE-LIPSTICK-MATTE-105-10ML"},
            {"id": 145, "name": "رژ لب مایع مخملی مات سرژه کد ۱۰۶", "brand": "سرژه", "gender": "زنانه", "type": "رژ لب مات", "volume_ml": 10, "color": "Magenta Pink", "price_toman": 977000, "stock": 10, "sku": "SERJE-LIPSTICK-MATTE-106-10ML"},
            {"id": 146, "name": "رژ لب مایع ابریشمی ساتین سرژه کد ۰۱", "brand": "سرژه", "gender": "زنانه", "type": "رژ لب ساتین", "volume_ml": 10, "color": "Pink True", "price_toman": 977000, "stock": 10, "sku": "SERJE-LIPSTICK-SATIN-201-10ML"},
            {"id": 147, "name": "رژ لب مایع ابریشمی ساتین سرژه کد ۲۰۲", "brand": "سرژه", "gender": "زنانه", "type": "رژ لب ساتین", "volume_ml": 10, "color": "Coral", "price_toman": 977000, "stock": 10, "sku": "SERJE-LIPSTICK-SATIN-202-10ML"}
        ]}
    ]
}

# Category 8: شامپو تخصصی
cat8 = {
    "id": 8, "name": "شامپو تخصصی",
    "subcategories": [
        {"id": 81, "name": "شامپو سر تخصصی", "products": [
            {"id": 148, "name": "شامپو سر جوانه گندم و Q10", "brand": "تراست", "gender": "یونیسکس", "type": "شامپو سر", "volume_ml": 250, "price_toman": 379000, "stock": 10, "sku": "TRUST-SHAMPOO-WHEAT-Q10-250ML"},
            {"id": 149, "name": "شامپو سر خاویار و ویتامین B6", "brand": "تراست", "gender": "یونیسکس", "type": "شامپو سر", "volume_ml": 250, "price_toman": 379000, "stock": 10, "sku": "TRUST-SHAMPOO-CAVIAR-B6-250ML"},
            {"id": 150, "name": "شامپو تخصصی تقویت کننده موهای چرب", "brand": "تراست", "gender": "یونیسکس", "type": "شامپو سر", "volume_ml": 200, "hair_type": "چرب", "price_toman": 497000, "stock": 10, "sku": "TRUST-SHAMPOO-STRENGTH-OILY-200ML"},
            {"id": 151, "name": "شامپو تخصصی تقویت کننده موهای خشک و نرمال", "brand": "تراست", "gender": "یونیسکس", "type": "شامپو سر", "volume_ml": 200, "hair_type": "خشک و نرمال", "price_toman": 497000, "stock": 10, "sku": "TRUST-SHAMPOO-STRENGTH-DRY-200ML"},
            {"id": 152, "name": "شامپو تخصصی ضد شوره مقاوم", "brand": "تراست", "gender": "یونیسکس", "type": "شامپو سر", "volume_ml": 200, "hair_type": "چرب", "price_toman": 497000, "stock": 10, "sku": "TRUST-SHAMPOO-ANTIDANDRUFF-INTENSE-200ML"},
            {"id": 153, "name": "شامپو تخصصی ضد شوره ملایم", "brand": "تراست", "gender": "یونیسکس", "type": "شامپو سر", "volume_ml": 200, "hair_type": "خشک و نرمال", "price_toman": 497000, "stock": 10, "sku": "TRUST-SHAMPOO-ANTIDANDRUFF-MILD-200ML"},
            {"id": 154, "name": "شامپو سر کراتین", "brand": "تراست", "gender": "یونیسکس", "type": "شامپو سر", "volume_ml": 250, "price_toman": 379000, "stock": 10, "sku": "TRUST-SHAMPOO-KERATIN-250ML"},
            {"id": 155, "name": "شامپو سر آرگان", "brand": "تراست", "gender": "یونیسکس", "type": "شامپو سر", "volume_ml": 250, "price_toman": 379000, "stock": 10, "sku": "TRUST-SHAMPOO-ARGAN-250ML"},
            {"id": 156, "name": "شامپو سر فلفل", "brand": "تراست", "gender": "یونیسکس", "type": "شامپو سر", "volume_ml": 250, "price_toman": 379000, "stock": 10, "sku": "TRUST-SHAMPOO-PEPPER-250ML"},
            {"id": 157, "name": "شامپو تثبیت کننده رنگ مو", "brand": "تراست", "gender": "یونیسکس", "type": "شامپو سر", "volume_ml": 200, "price_toman": 497000, "stock": 10, "sku": "TRUST-SHAMPOO-COLOR-FIX-200ML"},
            {"id": 158, "name": "شامپو سر نعناع و آلوئه‌ورا", "brand": "تراست", "gender": "یونیسکس", "type": "شامپو سر", "volume_ml": 250, "price_toman": 379000, "stock": 10, "sku": "TRUST-SHAMPOO-MINT-ALOE-250ML"},
            {"id": 159, "name": "شامپو بنفش تراست", "brand": "تراست", "gender": "یونیسکس", "type": "شامپو سر", "volume_ml": 120, "price_toman": 970000, "stock": 10, "sku": "TRUST-SHAMPOO-PURPLE-120ML"},
            {"id": 160, "name": "لوسیون اسکراب کف سر تراست", "brand": "تراست", "gender": "یونیسکس", "type": "اسکراب کف سر", "volume_ml": 120, "price_toman": 1390000, "stock": 10, "sku": "TRUST-SHAMPOO-SCRUB-120ML"}
        ]},
        {"id": 82, "name": "شامپو بدن تخصصی", "products": [
            {"id": 161, "name": "شامپو بدن چای سبز و لیمو", "brand": "تراست", "gender": "یونیسکس", "type": "شامپو بدن", "volume_ml": 250, "price_toman": 379000, "stock": 10, "sku": "TRUST-BODYWASH-GREENTEA-250ML"},
            {"id": 162, "name": "شامپو بدن عسل و کیوتن", "brand": "تراست", "gender": "یونیسکس", "type": "شامپو بدن", "volume_ml": 250, "price_toman": 379000, "stock": 10, "sku": "TRUST-BODYWASH-HONEY-Q10-250ML"},
            {"id": 163, "name": "شامپو بدن اسپرت زنانه", "brand": "تراست", "gender": "زنانه", "type": "شامپو بدن", "volume_ml": 250, "price_toman": 379000, "stock": 10, "sku": "TRUST-BODYWASH-SPORT-WOMEN-250ML"},
            {"id": 164, "name": "شامپو بدن اسپرت مردانه", "brand": "تراست", "gender": "مردانه", "type": "شامپو بدن", "volume_ml": 250, "price_toman": 379000, "stock": 10, "sku": "TRUST-BODYWASH-SPORT-MEN-250ML"},
            {"id": 165, "name": "شامپو بدن کرم پلاس", "brand": "تراست", "gender": "یونیسکس", "type": "شامپو بدن", "volume_ml": 200, "price_toman": 497000, "stock": 10, "sku": "TRUST-BODYWASH-CREAM-PLUS-200ML"},
            {"id": 166, "name": "شامپو بدن مغذی پوست", "brand": "تراست", "gender": "یونیسکس", "type": "شامپو بدن", "volume_ml": 250, "price_toman": 379000, "stock": 10, "sku": "TRUST-BODYWASH-COCONUT-250ML"},
            {"id": 167, "name": "شامپو بدن آنتی استرس", "brand": "تراست", "gender": "یونیسکس", "type": "شامپو بدن", "volume_ml": 250, "price_toman": 379000, "stock": 10, "sku": "TRUST-BODYWASH-COFFEE-250ML"}
        ]}
    ]
}

# Category 9: کیت تخصصی
cat9 = {
    "id": 9, "name": "کیت تخصصی",
    "subcategories": [
        {"id": 91, "name": "کیت تخصصی مو", "products": [
            {"id": 168, "name": "تونیک ضد ریزش و تقویت کننده مو", "brand": "تراست", "gender": "یونیسکس", "type": "تونیک مو", "volume_ml": 50, "price_toman": 879000, "stock": 10, "sku": "TRUST-TONIC-ANTIHAIRLOSS-50ML"},
            {"id": 169, "name": "تونیک ضد شوره و کنترل چربی مو", "brand": "تراست", "gender": "یونیسکس", "type": "تونیک مو", "volume_ml": 50, "price_toman": 879000, "stock": 10, "sku": "TRUST-TONIC-DANDRUFF-50ML"},
            {"id": 170, "name": "سرم کراتین و آرگان", "brand": "تراست", "gender": "یونیسکس", "type": "سرم مو", "volume_ml": 50, "price_toman": 747000, "stock": 10, "sku": "TRUST-SERUM-KERATIN-ARGAN-50ML"},
            {"id": 171, "name": "کیت تخصصی رویش مجدد موی سر", "brand": "تراست", "gender": "یونیسکس", "type": "کیت مو", "volume_ml": 280, "price_toman": 2977000, "stock": 10, "sku": "TRUST-KIT-HAIRGROWTH-280ML"},
            {"id": 172, "name": "لوسیون اسکراب کف سر تراست", "brand": "تراست", "gender": "یونیسکس", "type": "اسکراب کف سر", "volume_ml": 120, "price_toman": 1390000, "stock": 10, "sku": "TRUST-LOTION-SCRUB-120ML"}
        ]},
        {"id": 92, "name": "کیت تخصصی صورت", "products": [
            {"id": 173, "name": "کیت آنتی آکنه فوری تراست", "brand": "تراست", "gender": "یونیسکس", "type": "کیت صورت", "volume_ml": 35, "price_toman": 977000, "stock": 10, "sku": "TRUST-KIT-ANTIACNE-35ML"}
        ]},
        {"id": 93, "name": "کیت تخصصی بدن", "products": [
            {"id": 174, "name": "سرم ترمیم و تقویت ناخن تراست", "brand": "تراست", "gender": "یونیسکس", "type": "سرم ناخن", "volume_ml": 3, "price_toman": 977000, "stock": 10, "sku": "TRUST-SERUM-NAIL-3ML-KIT"}
        ]}
    ]
}

# Category 10: ماسک تخصصی
cat10 = {
    "id": 10, "name": "ماسک تخصصی",
    "subcategories": [
        {"id": 101, "name": "ماسک مو", "products": [
            {"id": 175, "name": "ماسک موی آبکشی آرگان و جوجوبا", "brand": "تراست", "gender": "یونیسکس", "type": "ماسک مو آبکشی", "volume_ml": 250, "price_toman": 747000, "stock": 10, "sku": "TRUST-HAIRMASK-RINSE-ARGAN-250ML"},
            {"id": 176, "name": "ماسک موی آبکشی کراتین", "brand": "تراست", "gender": "یونیسکس", "type": "ماسک مو آبکشی", "volume_ml": 250, "price_toman": 779000, "stock": 10, "sku": "TRUST-HAIRMASK-RINSE-KERATIN-250ML"},
            {"id": 177, "name": "ماسک موی بعد از حمام آرگان", "brand": "تراست", "gender": "یونیسکس", "type": "ماسک مو بعد از حمام", "volume_ml": 150, "price_toman": 637000, "stock": 10, "sku": "TRUST-HAIRMASK-LEAVEIN-ARGAN-150ML"},
            {"id": 178, "name": "ماسک موی بعد از حمام کراتین", "brand": "تراست", "gender": "یونیسکس", "type": "ماسک مو بعد از حمام", "volume_ml": 150, "price_toman": 647000, "stock": 10, "sku": "TRUST-HAIRMASK-LEAVEIN-KERATIN-150ML"}
        ]},
        {"id": 102, "name": "ماسک صورت", "products": [
            {"id": 179, "name": "ماسک اسکراب ویتامین سی تراست", "brand": "تراست", "gender": "یونیسکس", "type": "ماسک اسکراب صورت", "volume_ml": 150, "price_toman": 579000, "stock": 10, "sku": "TRUST-FACEMASK-VITAMINC-150ML"},
            {"id": 180, "name": "ماسک اسکراب زغال تراست", "brand": "تراست", "gender": "یونیسکس", "type": "ماسک اسکراب صورت", "volume_ml": 150, "price_toman": 579000, "stock": 10, "sku": "TRUST-FACEMASK-CHARCOAL-150ML"},
            {"id": 181, "name": "ماسک اسکراب زردچوبه تراست", "brand": "تراست", "gender": "یونیسکس", "type": "ماسک اسکراب صورت", "volume_ml": 150, "price_toman": 579000, "stock": 10, "sku": "TRUST-FACEMASK-TURMERIC-150ML"},
            {"id": 182, "name": "ماسک اسکراب قهوه تراست", "brand": "تراست", "gender": "یونیسکس", "type": "ماسک اسکراب صورت", "volume_ml": 150, "price_toman": 749000, "stock": 10, "sku": "TRUST-FACEMASK-COFFEE-150ML"}
        ]}
    ]
}

data["categories"].extend([cat7, cat8, cat9, cat10])

total = sum(len(sub["products"]) for cat in data["categories"] for sub in cat["subcategories"])
data["total_products"] = total

with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ Batch 3 added! Categories 7-10 done. Total products: {total}")
