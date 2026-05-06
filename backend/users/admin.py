from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ('email', 'name', 'is_staff', 'created_at')
    ordering      = ('-created_at',)
    search_fields = ('email', 'name')
    fieldsets     = (
        (None,       {'fields': ('email', 'password')}),
        ('Мэдээлэл', {'fields': ('name',)}),
        ('Эрх',      {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {'fields': ('email', 'name', 'password1', 'password2')}),
    )