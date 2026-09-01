from django.contrib import admin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'score', 'level', 'is_active')
    search_fields = ('username', )
    list_filter = ('is_active', 'level')

