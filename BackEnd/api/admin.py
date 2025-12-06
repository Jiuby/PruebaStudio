from django.contrib import admin
from .models import (
    Product,
    Collection,
    Category,
    Order,
    OrderItem,
    StoreSettings,
    ProductImage,
)

# Register your models here.


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "in_stock", "is_new")
    list_filter = ("category", "in_stock", "is_new", "collection")
    search_fields = ("name", "description")
    inlines = [ProductImageInline]


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ("title", "subtitle", "size")
    search_fields = ("title", "subtitle")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product", "name", "price", "quantity", "size", "image")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "customer_email", "date", "status", "total")
    list_filter = ("status", "date")
    search_fields = ("customer_email", "customer_name", "id")
    inlines = [OrderItemInline]


@admin.register(StoreSettings)
class StoreSettingsAdmin(admin.ModelAdmin):
    list_display = ("store_name", "maintenance_mode")


admin.site.register(ProductImage)
