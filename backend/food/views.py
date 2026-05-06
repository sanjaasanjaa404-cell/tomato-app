from rest_framework import generics, permissions, filters
from .models import Food, Category
from .serializers import FoodSerializer, CategorySerializer

class FoodListView(generics.ListAPIView):
    serializer_class   = FoodSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends    = [filters.SearchFilter]
    search_fields      = ['name', 'description', 'category__name']

    def get_queryset(self):
        qs       = Food.objects.filter(is_available=True).select_related('category')
        category = self.request.query_params.get('category')
        if category and category != 'All':
            qs = qs.filter(category__name=category)
        return qs

class FoodDetailView(generics.RetrieveAPIView):
    queryset           = Food.objects.filter(is_available=True)
    serializer_class   = FoodSerializer
    permission_classes = [permissions.AllowAny]

class CategoryListView(generics.ListAPIView):
    queryset           = Category.objects.all()
    serializer_class   = CategorySerializer
    permission_classes = [permissions.AllowAny]