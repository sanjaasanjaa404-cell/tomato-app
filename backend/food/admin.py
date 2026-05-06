from django.contrib import admin
from .models import Food, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display  = ('id', 'name', 'category', 'price', 'is_available')
    list_filter   = ('category', 'is_available')
    search_fields = ('name',)