from django.db import models
from django.conf import settings
from food.models import Food

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending',    'Хүлээгдэж байна'),
        ('confirmed',  'Баталгаажсан'),
        ('preparing',  'Бэлтгэж байна'),
        ('on_the_way', 'Хүргэлтэнд гарсан'),
        ('delivered',  'Хүргэгдсэн'),
        ('cancelled',  'Цуцалсан'),
    ]

    user         = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                     related_name='orders')
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    first_name   = models.CharField(max_length=100)
    last_name    = models.CharField(max_length=100)
    email        = models.EmailField()
    street       = models.CharField(max_length=255)
    city         = models.CharField(max_length=100)
    state        = models.CharField(max_length=100)
    zipcode      = models.CharField(max_length=20)
    country      = models.CharField(max_length=100)
    phone        = models.CharField(max_length=20)
    subtotal     = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=6,  decimal_places=2, default=2.99)
    total        = models.DecimalField(max_digits=10, decimal_places=2)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Order #{self.id} — {self.user.email}'

class OrderItem(models.Model):
    order    = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    food     = models.ForeignKey(Food,  on_delete=models.SET_NULL, null=True)
    name     = models.CharField(max_length=200)
    price    = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.PositiveIntegerField()

    @property
    def subtotal(self):
        return self.price * self.quantity

    def __str__(self):
        return f'{self.name} x{self.quantity}'