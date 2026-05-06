from rest_framework import serializers
from .models import Food, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ('id', 'name', 'image')

class FoodSerializer(serializers.ModelSerializer):
    category    = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    class Meta:
        model  = Food
        fields = ('id', 'name', 'description', 'price', 'image',
                  'category', 'category_id', 'is_available', 'created_at')