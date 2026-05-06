from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model  = OrderItem
        fields = ('id', 'food', 'name', 'price', 'quantity', 'subtotal')

class OrderItemCreateSerializer(serializers.Serializer):
    food_id  = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True, write_only=True)

    class Meta:
        model  = Order
        fields = (
            'first_name', 'last_name', 'email',
            'street', 'city', 'state', 'zipcode', 'country', 'phone',
            'items',
        )

    def create(self, validated_data):
        from food.models import Food
        items_data = validated_data.pop('items')
        subtotal   = 0
        item_objs  = []
        for item in items_data:
            food = Food.objects.get(id=item['food_id'])
            subtotal += food.price * item['quantity']
            item_objs.append({'food': food, 'quantity': item['quantity']})

        delivery_fee = 2.99
        total        = float(subtotal) + delivery_fee

        order = Order.objects.create(
            user         = self.context['request'].user,
            subtotal     = subtotal,
            delivery_fee = delivery_fee,
            total        = total,
            **validated_data,
        )
        for obj in item_objs:
            OrderItem.objects.create(
                order    = order,
                food     = obj['food'],
                name     = obj['food'].name,
                price    = obj['food'].price,
                quantity = obj['quantity'],
            )
        return order

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model  = Order
        fields = (
            'id', 'status', 'items',
            'first_name', 'last_name', 'email',
            'street', 'city', 'state', 'zipcode', 'country', 'phone',
            'subtotal', 'delivery_fee', 'total',
            'created_at', 'updated_at',
        )