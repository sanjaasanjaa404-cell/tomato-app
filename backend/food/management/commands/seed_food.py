from django.core.management.base import BaseCommand
from django.core.files import File
from food.models import Food, Category
import os

CATEGORIES = [
    {"name": "Salad",    "menu_image": "menu_1.png"},
    {"name": "Rolls",    "menu_image": "menu_2.png"},
    {"name": "Deserts",  "menu_image": "menu_3.png"},
    {"name": "Sandwich", "menu_image": "menu_4.png"},
    {"name": "Cake",     "menu_image": "menu_5.png"},
    {"name": "Pure Veg", "menu_image": "menu_6.png"},
    {"name": "Pasta",    "menu_image": "menu_7.png"},
    {"name": "Noodles",  "menu_image": "menu_8.png"},
]

FOODS = [
    {"name": "Greek salad",         "price": 12, "category": "Salad",    "image": "food_1.png",  "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Veg salad",           "price": 18, "category": "Salad",    "image": "food_2.png",  "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Clover Salad",        "price": 16, "category": "Salad",    "image": "food_3.png",  "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Chicken Salad",       "price": 24, "category": "Salad",    "image": "food_4.png",  "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Lasagna Rolls",       "price": 14, "category": "Rolls",    "image": "food_5.png",  "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Peri Peri Rolls",     "price": 12, "category": "Rolls",    "image": "food_6.png",  "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Chicken Rolls",       "price": 20, "category": "Rolls",    "image": "food_7.png",  "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Veg Rolls",           "price": 15, "category": "Rolls",    "image": "food_8.png",  "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Ripple Ice Cream",    "price": 14, "category": "Deserts",  "image": "food_9.png",  "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Fruit Ice Cream",     "price": 22, "category": "Deserts",  "image": "food_10.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Jar Ice Cream",       "price": 10, "category": "Deserts",  "image": "food_11.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Vanilla Ice Cream",   "price": 12, "category": "Deserts",  "image": "food_12.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Chicken Sandwich",    "price": 12, "category": "Sandwich", "image": "food_13.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Vegan Sandwich",      "price": 18, "category": "Sandwich", "image": "food_14.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Grilled Sandwich",    "price": 16, "category": "Sandwich", "image": "food_15.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Bread Sandwich",      "price": 24, "category": "Sandwich", "image": "food_16.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Cup Cake",            "price": 14, "category": "Cake",     "image": "food_17.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Vegan Cake",          "price": 12, "category": "Cake",     "image": "food_18.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Butterfly Cake",      "price": 20, "category": "Cake",     "image": "food_19.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Sliced Cake",         "price": 15, "category": "Cake",     "image": "food_20.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Garlic Mushroom",     "price": 14, "category": "Pure Veg", "image": "food_21.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Fried Cauliflower",   "price": 22, "category": "Pure Veg", "image": "food_22.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Mix Veg Pulav",       "price": 10, "category": "Pure Veg", "image": "food_23.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Rice Zucchini",       "price": 12, "category": "Pure Veg", "image": "food_24.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Cheese Pasta",        "price": 12, "category": "Pasta",    "image": "food_25.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Tomato Pasta",        "price": 18, "category": "Pasta",    "image": "food_26.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Creamy Pasta",        "price": 16, "category": "Pasta",    "image": "food_27.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Chicken Pasta",       "price": 24, "category": "Pasta",    "image": "food_28.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Buttter Noodles",     "price": 14, "category": "Noodles",  "image": "food_29.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Veg Noodles",         "price": 12, "category": "Noodles",  "image": "food_30.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Somen Noodles",       "price": 20, "category": "Noodles",  "image": "food_31.png", "description": "Food provides essential nutrients for overall health and well-being"},
    {"name": "Cooked Noodles",      "price": 15, "category": "Noodles",  "image": "food_32.png", "description": "Food provides essential nutrients for overall health and well-being"},
]


class Command(BaseCommand):
    help = 'Seed food and category data from assets'

    def handle(self, *args, **kwargs):
        assets_path = '/app/seed_images'

        # Categories
        for cat_data in CATEGORIES:
            category, created = Category.objects.get_or_create(name=cat_data['name'])
            img_path = os.path.join(assets_path, cat_data['menu_image'])
            if created and os.path.exists(img_path):
                with open(img_path, 'rb') as f:
                    category.image.save(cat_data['menu_image'], File(f), save=True)
                self.stdout.write(f"✅ Category нэмлээ: {category.name}")
            else:
                self.stdout.write(f"⏭ Category байгаа: {category.name}")

        # Foods
        for food_data in FOODS:
            category = Category.objects.get(name=food_data['category'])
            food, created = Food.objects.get_or_create(
                name=food_data['name'],
                defaults={
                    'description': food_data['description'],
                    'price': food_data['price'],
                    'category': category,
                }
            )
            img_path = os.path.join(assets_path, food_data['image'])
            if created and os.path.exists(img_path):
                with open(img_path, 'rb') as f:
                    food.image.save(food_data['image'], File(f), save=True)
                self.stdout.write(f"✅ Хоол нэмлээ: {food.name}")
            else:
                self.stdout.write(f"⏭ Хоол байгаа: {food.name}")

        self.stdout.write(self.style.SUCCESS('✅ Seed бүрэн дууслаа!'))