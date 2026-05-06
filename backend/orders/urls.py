from django.urls import path
from .views import OrderListCreateView, OrderDetailView, CreateCheckoutSessionView, VerifyPaymentView

urlpatterns = [
    path('',               OrderListCreateView.as_view(),     name='order-list-create'),
    path('<int:pk>/',      OrderDetailView.as_view(),          name='order-detail'),
    path('checkout/',      CreateCheckoutSessionView.as_view(), name='checkout'),
    path('verify/',        VerifyPaymentView.as_view(),         name='verify-payment'),
]