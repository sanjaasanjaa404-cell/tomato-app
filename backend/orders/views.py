import stripe
import os
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer, OrderCreateSerializer

stripe.api_key = os.getenv('STRIPE_SECRET_KEY', '')

class OrderListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return OrderCreateSerializer
        return OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')

    def create(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            order = serializer.save()
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class   = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class CreateCheckoutSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            from food.models import Food
            items_data = request.data.get('items', [])
            delivery_data = request.data.get('delivery', {})

            line_items = []
            subtotal = 0
            item_objs = []

            for item in items_data:
                food = Food.objects.get(id=item['food_id'])
                subtotal += food.price * item['quantity']
                item_objs.append({'food': food, 'quantity': item['quantity']})
                line_items.append({
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {'name': food.name},
                        'unit_amount': int(food.price * 100),
                    },
                    'quantity': item['quantity'],
                })

            # Хүргэлтийн төлбөр
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': {'name': 'Delivery Fee'},
                    'unit_amount': 299,
                },
                'quantity': 1,
            })

            # Order үүсгэх
            delivery_fee = 2.99
            total = float(subtotal) + delivery_fee

            order = Order.objects.create(
                user         = request.user,
                subtotal     = subtotal,
                delivery_fee = delivery_fee,
                total        = total,
                status       = 'pending',
                **delivery_data,
            )

            for obj in item_objs:
                from orders.models import OrderItem
                OrderItem.objects.create(
                    order    = order,
                    food     = obj['food'],
                    name     = obj['food'].name,
                    price    = obj['food'].price,
                    quantity = obj['quantity'],
                )

            # Stripe session үүсгэх
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                success_url=f'http://localhost:5173/verify?success=true&orderId={order.id}',
                cancel_url=f'http://localhost:5173/verify?success=false&orderId={order.id}',
                metadata={'order_id': order.id},
            )

            return Response({'session_url': session.url, 'order_id': order.id})

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        success  = request.data.get('success')

        try:
            order = Order.objects.get(id=order_id, user=request.user)
            if success == 'true':
                order.status = 'confirmed'
                order.save()
                return Response({'success': True, 'message': 'Төлбөр амжилттай'})
            else:
                order.delete()
                return Response({'success': False, 'message': 'Төлбөр цуцлагдлаа'})
        except Order.DoesNotExist:
            return Response({'error': 'Захиалга олдсонгүй'}, status=404)