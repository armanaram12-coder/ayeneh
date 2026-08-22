import json

with open('src/data/products.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Category 3: کرم تخصصی
cat3 = {
    "id": 3, "name": "کرم تخصصی",
    "subcategories": [
        {"id": 31, "name": "کرم تخصصی صورت", "products": [
            {"id": 54, "name": "کرم آبرسان پوست خشک و نرمال", "brand": "تراست", "gender": "یونیسکس", "type": "کرم آبرسان", "volume_ml": 50, "price_toman": 449000, "stock": 10, "sku": "TRUST-CREAM-HYDRA-DRY-50ML"},
            {"id": 55, "name": "کرم کنترل کننده آکنه و چربی پوست", "brand": "تراست", "gender": "یونیسکس", "type": "کرم ضد آکنه", "volume_ml": 30, "price_toman": 449000, "stock": 10, "sku": "TRUST-CREAM-ANTIACNE-30ML"},
            {"id": 56, "name": "کرم سفت کننده پوست صورت", "brand": "تراست", "gender": "یونیسکس", "type": "کرم لیفت", "volume_ml": 50, "price_toman": 579000, "stock": 10, "sku": "TRUST-CREAM-FIRMING-50ML"},
            {"id": 57, "name": "کرم ابرو", "brand": "تراست", "gender": "یونیسکس", "type": "کرم ابرو", "volume_ml": 15, "price_toman": 299000, "stock": 10, "sku": "TRUST-CREAM-EYEBROW-15ML"},
            {"id": 58, "name": "کرم دور چشم", "brand": "تراست", "gender": "یونیسکس", "type": "کرم دور چشم", "volume_ml": 20, "price_toman": 597000, "stock": 10, "sku": "TRUST-CREAM-EYE-20ML"},
            {"id": 59, "name": "کرم ویتامین سی تراست", "brand": "تراست", "gender": "یونیسکس", "type": "کرم صورت", "volume_ml": 30, "price_toman": 497000, "stock": 10, "sku": "TRUST-CREAM-VITAMINC-30ML"},
            {"id": 60, "name": "کرم روشن کننده و ضد لک", "brand": "تراست", "gender": "یونیسکس", "type": "کرم ضد لک", "volume_ml": 30, "price_toman": 497000, "stock": 10, "sku": "TRUST-CREAM-BRIGHTENING-30ML"},
            {"id": 61, "name": "کرم جوانساز کلاژن تراست", "brand": "تراست", "gender": "یونیسکس", "type": "کرم کلاژن", "volume_ml": 50, "price_toman": 997000, "stock": 10, "sku": "TRUST-CREAM-COLLAGEN-50ML"},
            {"id": 62, "name": "کرم جوانساز رتینول تراست", "brand": "تراست", "gender": "یونیسکس", "type": "کرم رتینول", "volume_ml": 50, "price_toman": 997000, "stock": 10, "sku": "TRUST-CREAM-RETINOL-50ML"},
            {"id": 63, "name": "کرم لایه‌بردار آلفاتراست حاوی 10% AHA", "brand": "تراست", "gender": "یونیسکس", "type": "کرم لایه‌بردار", "volume_ml": 30, "price_toman": 497000, "stock": 10, "sku": "TRUST-CREAM-AHA10-30ML"},
            {"id": 64, "name": "بالم لب ترمیم کننده تراست", "brand": "تراست", "gender": "یونیسکس", "type": "بالم لب", "volume_ml": 15, "price_toman": 247000, "stock": 10, "sku": "TRUST-CREAM-LIPBALM-15ML"},
            {"id": 65, "name": "کرم آبرسان پوست چرب تا مختلط", "brand": "تراست", "gender": "یونیسکس", "type": "کرم آبرسان", "volume_ml": 50, "price_toman": 449000, "stock": 10, "sku": "TRUST-CREAM-HYDRA-OILY-50ML"},
            {"id": 66, "name": "کرم روز تراست اسمارت", "brand": "تراست اسمارت", "gender": "یونیسکس", "type": "کرم روز", "volume_ml": 50, "price_toman": 1797000, "stock": 10, "sku": "TRUST-SMART-CREAM-DAY-50ML"},
            {"id": 67, "name": "کرم شب تراست اسمارت", "brand": "تراست اسمارت", "gender": "یونیسکس", "type": "کرم شب", "volume_ml": 50, "price_toman": 1797000, "stock": 10, "sku": "TRUST-SMART-CREAM-NIGHT-50ML"},
            {"id": 68, "name": "کرم سفت کننده، لیفت و ضدچروک تراست اسمارت", "brand": "تراست اسمارت", "gender": "یونیسکس", "type": "کرم لیفت", "volume_ml": 50, "price_toman": 1970000, "stock": 10, "sku": "TRUST-SMART-CREAM-LIFT-50ML"},
            {"id": 69, "name": "کرم جوانساز، لیفت و ضد چروک دور چشم تراست اسمارت", "brand": "تراست اسمارت", "gender": "یونیسکس", "type": "کرم دور چشم", "volume_ml": 15, "price_toman": 1379000, "stock": 10, "sku": "TRUST-SMART-CREAM-EYE-15ML"},
            {"id": 70, "name": "ژل کرم واتر بانک تراست اسمارت", "brand": "تراست اسمارت", "gender": "یونیسکس", "type": "ژل کرم", "volume_ml": 50, "price_toman": 1479000, "stock": 10, "sku": "TRUST-SMART-CREAM-WATERBANK-50ML"},
            {"id": 71, "name": "کرم سه گانه هوشمند تراست اسمارت", "brand": "تراست اسمارت", "gender": "یونیسکس", "type": "کرم صورت", "volume_ml": 50, "price_toman": 5470000, "stock": 10, "sku": "TRUST-SMART-CREAM-TRIPLE-50ML"},
            {"id": 72, "name": "کرم خاویار تراست اسمارت", "brand": "تراست اسمارت", "gender": "یونیسکس", "type": "کرم صورت", "volume_ml": 30, "price_toman": 7470000, "stock": 10, "sku": "TRUST-SMART-CREAM-CAVIAR-30ML"}
        ]},
        {"id": 32, "name": "کرم تخصصی بدن", "products": [
            {"id": 73, "name": "کرم دست و بدن میوه‌های استوایی", "brand": "تراست", "gender": "یونیسکس", "type": "کرم بدن", "volume_ml": 150, "price_toman": 497000, "stock": 10, "sku": "TRUST-CREAM-BODY-TROPICAL-150ML"},
            {"id": 74, "name": "کرم دست و بدن پروتئین شیر و عسل", "brand": "تراست", "gender": "یونیسکس", "type": "کرم بدن", "volume_ml": 150, "price_toman": 397000, "stock": 10, "sku": "TRUST-CREAM-BODY-HONEY-150ML"},
            {"id": 75, "name": "کرم دست و بدن انار و Q10", "brand": "تراست", "gender": "یونیسکس", "type": "کرم بدن", "volume_ml": 150, "price_toman": 497000, "stock": 10, "sku": "TRUST-CREAM-BODY-POMEGRANATE-150ML"},
            {"id": 76, "name": "کرم ترمیم کننده مناسب انواع پوست تراست", "brand": "تراست", "gender": "یونیسکس", "type": "کرم ترمیم", "volume_ml": 30, "price_toman": 579000, "stock": 10, "sku": "TRUST-CREAM-REPAIR-30ML"},
            {"id": 77, "name": "کرم ترمیم کننده ناخن", "brand": "تراست", "gender": "یونیسکس", "type": "کرم ناخن", "volume_ml": 15, "price_toman": 297000, "stock": 10, "sku": "TRUST-CREAM-NAIL-15ML"},
            {"id": 78, "name": "کرم دست و بدن آووکادو", "brand": "تراست", "gender": "یونیسکس", "type": "کرم بدن", "volume_ml": 150, "price_toman": 497000, "stock": 10, "sku": "TRUST-CREAM-BODY-AVOCADO-150ML"},
            {"id": 79, "name": "کرم تخصصی دست ضدآفتاب و آبرسان SPF30+ بی‌رنگ تراست", "brand": "تراست", "gender": "یونیسکس", "type": "کرم دست SPF", "volume_ml": 60, "price_toman": 579000, "stock": 10, "sku": "TRUST-CREAM-HAND-SPF30-60ML"},
            {"id": 80, "name": "کرم ترمیم کننده ترک پا کلاس یک", "brand": "تراست", "gender": "یونیسکس", "type": "کرم پا", "volume_ml": 75, "price_toman": 447000, "stock": 10, "sku": "TRUST-CREAM-FOOT-75ML"},
            {"id": 81, "name": "کرم سفت کننده و لیفت کننده گردن و دکلته", "brand": "تراست", "gender": "یونیسکس", "type": "کرم گردن", "volume_ml": 120, "price_toman": 1279000, "stock": 10, "sku": "TRUST-CREAM-NECK-120ML"}
        ]}
    ]
}

# Category 4: ضد آفتاب
cat4 = {
    "id": 4, "name": "ضد آفتاب",
    "subcategories": [{"id": 41, "name": "ضد آفتاب", "products": [
        {"id": 82, "name": "کرم ضد آفتاب و ضد پیری (پوست خشک تا نرمال) (فاقد رنگ)", "brand": "تراست", "gender": "یونیسکس", "type": "ضد آفتاب", "volume_ml": 40, "price_toman": 597000, "stock": 10, "sku": "TRUST-SUNSCREEN-ANTIAGING-DRY-40ML"},
        {"id": 83, "name": "کرم ضد آفتاب و کنترل چربی (پوست مختلط تا چرب) (فاقد رنگ)", "brand": "تراست", "gender": "یونیسکس", "type": "ضد آفتاب", "volume_ml": 40, "price_toman": 597000, "stock": 10, "sku": "TRUST-SUNSCREEN-OILCONTROL-OILY-40ML"},
        {"id": 84, "name": "کرم ضد آفتاب رنگی و ضد پیری بژ تیره (پوست خشک تا نرمال)", "brand": "تراست", "gender": "یونیسکس", "type": "ضد آفتاب رنگی", "volume_ml": 40, "color": "Dark Beige", "skin_type": "خشک تا نرمال", "price_toman": 597000, "stock": 10, "sku": "TRUST-SUNSCREEN-TINTED-DARK-DRY-40ML"},
        {"id": 85, "name": "کرم ضد آفتاب رنگی و ضد پیری بژ روشن (پوست خشک تا نرمال)", "brand": "تراست", "gender": "یونیسکس", "type": "ضد آفتاب رنگی", "volume_ml": 40, "color": "Light Beige", "skin_type": "خشک تا نرمال", "price_toman": 597000, "stock": 10, "sku": "TRUST-SUNSCREEN-TINTED-LIGHT-DRY-40ML"},
        {"id": 86, "name": "کرم ضد آفتاب رنگی و کنترل چربی بژ طبیعی (پوست مختلط تا چرب)", "brand": "تراست", "gender": "یونیسکس", "type": "ضد آفتاب رنگی", "volume_ml": 40, "color": "Natural Beige", "skin_type": "مختلط تا چرب", "price_toman": 597000, "stock": 10, "sku": "TRUST-SUNSCREEN-TINTED-NATURAL-OILY-40ML"},
        {"id": 87, "name": "کرم ضد آفتاب رنگی و ضد پیری بژ طبیعی (پوست خشک تا نرمال)", "brand": "تراست", "gender": "یونیسکس", "type": "ضد آفتاب رنگی", "volume_ml": 40, "color": "Natural Beige", "skin_type": "خشک تا نرمال", "price_toman": 597000, "stock": 10, "sku": "TRUST-SUNSCREEN-TINTED-NATURAL-DRY-40ML"},
        {"id": 88, "name": "کرم ضد آفتاب رنگی و کنترل چربی بژ تیره (پوست مختلط تا چرب)", "brand": "تراست", "gender": "یونیسکس", "type": "ضد آفتاب رنگی", "volume_ml": 40, "color": "Dark Beige", "skin_type": "مختلط تا چرب", "price_toman": 597000, "stock": 10, "sku": "TRUST-SUNSCREEN-TINTED-DARK-OILY-40ML"},
        {"id": 89, "name": "کرم ضد آفتاب رنگی و کنترل چربی بژ روشن (پوست مختلط تا چرب)", "brand": "تراست", "gender": "یونیسکس", "type": "ضد آفتاب رنگی", "volume_ml": 40, "color": "Light Beige", "skin_type": "مختلط تا چرب", "price_toman": 597000, "stock": 10, "sku": "TRUST-SUNSCREEN-TINTED-LIGHT-OILY-40ML"},
        {"id": 90, "name": "دیپ فیوژن واتر تراست اسمارت", "brand": "تراست اسمارت", "gender": "یونیسکس", "type": "ضد آفتاب", "volume_ml": 40, "price_toman": 1279000, "stock": 10, "sku": "TRUST-SMART-SUNSCREEN-WATER-40ML"},
        {"id": 91, "name": "کرم ضدآفتاب SPF100 تراست اسمارت", "brand": "تراست اسمارت", "gender": "یونیسکس", "type": "ضد آفتاب", "volume_ml": 50, "price_toman": 1470000, "stock": 10, "sku": "TRUST-SMART-SUNSCREEN-SPF100-50ML"}
    ]}]
}

# Category 5: شوینده و پاک کننده
cat5 = {
    "id": 5, "name": "شوینده و پاک کننده",
    "subcategories": [
        {"id": 51, "name": "ژل شستشو", "products": [
            {"id": 92, "name": "ژل شستشو روشن‌کننده حاوی ویتامین سی تراست", "brand": "تراست", "gender": "یونیسکس", "type": "ژل شستشو", "volume_ml": 180, "price_toman": 579000, "stock": 10, "sku": "TRUST-WASH-VITC-180ML"},
            {"id": 93, "name": "ژل شستشو کنترل کننده آکنه تراست", "brand": "تراست", "gender": "یونیسکس", "type": "ژل شستشو", "volume_ml": 180, "price_toman": 579000, "stock": 10, "sku": "TRUST-WASH-ACNE-180ML"},
            {"id": 94, "name": "ژل شستشو آبرسان پوست تراست", "brand": "تراست", "gender": "یونیسکس", "type": "ژل شستشو", "volume_ml": 180, "price_toman": 579000, "stock": 10, "sku": "TRUST-WASH-HYDRA-180ML"}
        ]},
        {"id": 52, "name": "تونر", "products": [
            {"id": 95, "name": "تونر مناسب پوست چرب تا مختلط تراست", "brand": "تراست", "gender": "یونیسکس", "type": "تونر", "volume_ml": 260, "skin_type": "چرب تا مختلط", "price_toman": 479000, "stock": 10, "sku": "TRUST-TONER-NIACINAMIDE-260ML"},
            {"id": 96, "name": "تونر مناسب پوست نرمال تا خشک تراست", "brand": "تراست", "gender": "یونیسکس", "type": "تونر", "volume_ml": 260, "skin_type": "نرمال تا خشک", "price_toman": 479000, "stock": 10, "sku": "TRUST-TONER-HYALURONIC-260ML"}
        ]},
        {"id": 53, "name": "میسلار", "products": [
            {"id": 97, "name": "محلول میسلار پاک کننده آرایش (پوست مختلط تا چرب)", "brand": "تراست", "gender": "یونیسکس", "type": "میسلار", "volume_ml": 250, "skin_type": "مختلط تا چرب", "price_toman": 379000, "stock": 10, "sku": "TRUST-MICELLAR-OILY-250ML"},
            {"id": 98, "name": "محلول میسلار پاک کننده آرایش (پوست خشک و حساس)", "brand": "تراست", "gender": "یونیسکس", "type": "میسلار", "volume_ml": 250, "skin_type": "خشک و حساس", "price_toman": 379000, "stock": 10, "sku": "TRUST-MICELLAR-SENSITIVE-250ML"}
        ]},
        {"id": 54, "name": "محلول دو فازی", "products": [
            {"id": 99, "name": "محلول پاک‌کننده آرایش دوفازی تراست", "brand": "تراست", "gender": "یونیسکس", "type": "محلول دو فازی", "volume_ml": 130, "price_toman": 679000, "stock": 10, "sku": "TRUST-BIPHASIC-130ML"}
        ]},
        {"id": 55, "name": "فوم", "products": [
            {"id": 100, "name": "فوم شستشوی صورت مناسب پوست مختلط تا چرب", "brand": "تراست", "gender": "یونیسکس", "type": "فوم", "volume_ml": 170, "skin_type": "مختلط تا چرب", "price_toman": 697000, "stock": 10, "sku": "TRUST-FOAM-OILY-170ML"},
            {"id": 101, "name": "فوم شستشوی صورت مناسب پوست حساس و نرمال", "brand": "تراست", "gender": "یونیسکس", "type": "فوم", "volume_ml": 170, "skin_type": "حساس و نرمال", "price_toman": 697000, "stock": 10, "sku": "TRUST-FOAM-SENSITIVE-170ML"},
            {"id": 102, "name": "محلول شارژ فوم شستشوی صورت مناسب پوست مختلط تا چرب", "brand": "تراست", "gender": "یونیسکس", "type": "شارژ فوم", "volume_ml": 400, "skin_type": "مختلط تا چرب", "price_toman": 1079000, "stock": 10, "sku": "TRUST-FOAM-REFILL-OILY-400ML"},
            {"id": 103, "name": "محلول شارژ فوم شستشوی صورت مناسب پوست حساس و نرمال", "brand": "تراست", "gender": "یونیسکس", "type": "شارژ فوم", "volume_ml": 400, "skin_type": "حساس و نرمال", "price_toman": 1079000, "stock": 10, "sku": "TRUST-FOAM-REFILL-SENSITIVE-400ML"}
        ]},
        {"id": 56, "name": "صابون بهداشتی", "products": [
            {"id": 104, "name": "صابون آووکادو و زیتون", "brand": "تراست", "gender": "یونیسکس", "type": "صابون", "volume_gram": 75, "price_toman": 287000, "stock": 10, "sku": "TRUST-SOAP-AVOCADO-75G"},
            {"id": 105, "name": "صابون توت فرنگی", "brand": "تراست", "gender": "یونیسکس", "type": "صابون", "volume_gram": 75, "price_toman": 287000, "stock": 10, "sku": "TRUST-SOAP-STRAWBERRY-75G"},
            {"id": 106, "name": "صابون شیر و Q10", "brand": "تراست", "gender": "یونیسکس", "type": "صابون", "volume_gram": 75, "price_toman": 287000, "stock": 10, "sku": "TRUST-SOAP-MILK-Q10-75G"},
            {"id": 107, "name": "صابون بره موم عسل", "brand": "تراست", "gender": "یونیسکس", "type": "صابون", "volume_gram": 75, "price_toman": 287000, "stock": 10, "sku": "TRUST-SOAP-HONEY-75G"},
            {"id": 108, "name": "صابون ذغال بامبو و نارگیل", "brand": "تراست", "gender": "یونیسکس", "type": "صابون", "volume_gram": 75, "price_toman": 287000, "stock": 10, "sku": "TRUST-SOAP-CHARCOAL-75G"},
            {"id": 109, "name": "صابون عصاره شترمرغ", "brand": "تراست", "gender": "یونیسکس", "type": "صابون", "volume_gram": 75, "price_toman": 287000, "stock": 10, "sku": "TRUST-SOAP-OSTRICH-75G"}
        ]},
        {"id": 57, "name": "پن", "products": [
            {"id": 110, "name": "پن روشن کننده و ضد لک صورت و بدن", "brand": "تراست", "gender": "یونیسکس", "type": "پن", "volume_gram": 100, "price_toman": 397000, "stock": 10, "sku": "TRUST-PAIN-BRIGHTENING-100G"},
            {"id": 111, "name": "پن آبرسان پوست‌های خشک تا نرمال", "brand": "تراست", "gender": "یونیسکس", "type": "پن", "volume_gram": 100, "price_toman": 397000, "stock": 10, "sku": "TRUST-PAIN-HYDRA-DRY-100G"},
            {"id": 112, "name": "پن لایه‌بردار آلفاتراست حاوی 10% AHA", "brand": "تراست", "gender": "یونیسکس", "type": "پن", "volume_gram": 100, "price_toman": 397000, "stock": 10, "sku": "TRUST-PAIN-AHA10-100G"},
            {"id": 113, "name": "پن ضد جوش و آکنه", "brand": "تراست", "gender": "یونیسکس", "type": "پن", "volume_gram": 100, "price_toman": 397000, "stock": 10, "sku": "TRUST-PAIN-ANTIACNE-100G"},
            {"id": 114, "name": "پن آبرسان پوست چرب و مختلط", "brand": "تراست", "gender": "یونیسکس", "type": "پن", "volume_gram": 100, "price_toman": 397000, "stock": 10, "sku": "TRUST-PAIN-HYDRA-OILY-100G"}
        ]},
        {"id": 58, "name": "مایع دستشویی", "products": [
            {"id": 115, "name": "مایع دستشویی تراست", "brand": "تراست", "gender": "یونیسکس", "type": "مایع دستشویی", "price_toman": 0, "stock": 0, "status": "ناموجود", "sku": "TRUST-HANDWASH-PLACEHOLDER"}
        ]}
    ]
}

# Category 6: دهان و دندان
cat6 = {
    "id": 6, "name": "دهان و دندان",
    "subcategories": [
        {"id": 61, "name": "خمیر دندان", "products": [
            {"id": 116, "name": "خمیر دندان توتال گرین برند لایف گارد با حجم ۰۰ گرم", "brand": "LifeGuard Green", "gender": "یونیسکس", "type": "خمیر دندان", "volume_gram": 100, "price_toman": 379000, "stock": 10, "sku": "LIFEGUARD-TOOTHPASTE-TOTAL-100G"},
            {"id": 117, "name": "خمیر دندان سفیدکننده گرین برند لایف گارد با حجم ۱۰ گرم", "brand": "LifeGuard Green", "gender": "یونیسکس", "type": "خمیر دندان", "volume_gram": 100, "price_toman": 379000, "stock": 10, "sku": "LIFEGUARD-TOOTHPASTE-WHITENING-100G"},
            {"id": 118, "name": "خمیر دندان محافظ دندان و لثه حساس گرین برند لایف گارد با حجم ۱۰۰ گرم", "brand": "LifeGuard Green", "gender": "یونیسکس", "type": "خمیر دندان", "volume_gram": 100, "price_toman": 379000, "stock": 10, "sku": "LIFEGUARD-TOOTHPASTE-SENSITIVE-100G"}
        ]},
        {"id": 62, "name": "دهان‌شویه", "products": [
            {"id": 119, "name": "دهان‌شویه بزرگسال توتال (Gold Guard) برند لایف گارد با حجم ۲۰ میلی لیتر", "brand": "LifeGuard", "gender": "یونیسکس", "type": "دهان‌شویه", "volume_ml": 270, "price_toman": 349000, "stock": 10, "sku": "LIFEGUARD-MOUTHWASH-GOLD-270ML"},
            {"id": 120, "name": "دهان‌شویه بزرگسال سفیدکننده (Silver Guard) برند لایف گارد با حجم ۲۰ میلی لیتر", "brand": "LifeGuard", "gender": "یونیسکس", "type": "دهان‌شویه", "volume_ml": 270, "price_toman": 349000, "stock": 10, "sku": "LIFEGUARD-MOUTHWASH-SILVER-270ML"},
            {"id": 121, "name": "دهان‌شویه بزرگسال حساس (Red Guard) برند لایف گارد با حجم ۲۷۰ میلی لیتر", "brand": "LifeGuard", "gender": "یونیسکس", "type": "دهان‌شویه", "volume_ml": 270, "price_toman": 349000, "stock": 10, "sku": "LIFEGUARD-MOUTHWASH-RED-270ML"}
        ]},
        {"id": 63, "name": "خوشبوکننده دهان", "products": [
            {"id": 122, "name": "خوشبوکننده دهان با طعم نعناع و لیمو لایف گارد", "brand": "LifeGuard", "gender": "یونیسکس", "type": "خوشبوکننده دهان", "volume_ml": 30, "price_toman": 287000, "stock": 10, "sku": "LIFEGUARD-MOUTHSPRAY-MINT-LEMON-30ML"},
            {"id": 123, "name": "خوشبوکننده دهان با طعم دارچین و نعناع لایف گارد", "brand": "LifeGuard", "gender": "یونیسکس", "type": "خوشبوکننده دهان", "volume_ml": 30, "price_toman": 287000, "stock": 10, "sku": "LIFEGUARD-MOUTHSPRAY-CINNAMON-MINT-30ML"}
        ]}
    ]
}

data["categories"].extend([cat3, cat4, cat5, cat6])

total = sum(len(sub["products"]) for cat in data["categories"] for sub in cat["subcategories"])
data["total_products"] = total

with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ Batch 2 added! Categories 3-6 done. Total products: {total}")
