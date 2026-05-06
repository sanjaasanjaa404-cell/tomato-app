from django.urls import path
from .views import FoodListView, FoodDetailView, CategoryListView

urlpatterns = [
    path('',            FoodListView.as_view(),    name='food-list'),
    path('<int:pk>/',   FoodDetailView.as_view(),  name='food-detail'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
]