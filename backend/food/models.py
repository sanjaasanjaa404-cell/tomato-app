from django.db import models

class Category(models.Model):
    name  = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

class Food(models.Model):
    name         = models.CharField(max_length=200)
    description  = models.TextField()
    price        = models.DecimalField(max_digits=8, decimal_places=2)
    image        = models.ImageField(upload_to='foods/')
    category     = models.ForeignKey(Category, on_delete=models.SET_NULL,
                                     null=True, related_name='foods')
    is_available = models.BooleanField(default=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name