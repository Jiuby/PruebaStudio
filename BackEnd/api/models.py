from django.db import models
from django.contrib.auth.models import User

class Collection(models.Model):
    SIZE_CHOICES = [
        ('large', 'Large'),
        ('medium', 'Medium'),
        ('small', 'Small'),
    ]
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200)
    image = models.ImageField(upload_to='collections/')
    category = models.CharField(max_length=100, blank=True, null=True)
    size = models.CharField(max_length=20, choices=SIZE_CHOICES, default='medium')

    def __str__(self):
        return self.title

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=0)
    original_price = models.DecimalField(max_digits=10, decimal_places=0, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    collection = models.ForeignKey(Collection, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    image = models.ImageField(upload_to='products/', blank=True)
    secondary_image = models.ImageField(upload_to='products/', blank=True, null=True)
    is_new = models.BooleanField(default=True)
    description = models.TextField(blank=True)
    in_stock = models.BooleanField(default=True)
    
    # Storing lists as JSON
    details = models.JSONField(default=list, blank=True)
    colors = models.JSONField(default=list, blank=True)
    sizes = models.JSONField(default=list, blank=True)
    available_sizes = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='additional_images')
    image = models.ImageField(upload_to='products/gallery/')

    def __str__(self):
        return f"Image for {self.product.name}"

class Order(models.Model):
    STATUS_CHOICES = [
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]
    
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Processing')
    total = models.DecimalField(max_digits=12, decimal_places=0)
    
    customer_name = models.CharField(max_length=200, blank=True, null=True)
    customer_email = models.EmailField(blank=True, null=True)
    
    # Storing shipping details as JSON
    shipping_details = models.JSONField(default=dict, blank=True)
    
    def __str__(self):
        return f"Order {self.id} - {self.customer_email}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200)
    image = models.CharField(max_length=500) # Store URL or path snapshot
    price = models.DecimalField(max_digits=10, decimal_places=0)
    quantity = models.IntegerField(default=1)
    size = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.quantity}x {self.name} ({self.size})"

class StoreSettings(models.Model):
    store_name = models.CharField(max_length=100, default='GOUSTTY')
    support_email = models.EmailField(default='support@goustty.com')
    currency = models.CharField(max_length=10, default='COP')
    shipping_flat_rate = models.DecimalField(max_digits=10, decimal_places=0, default=12000)
    free_shipping_threshold = models.DecimalField(max_digits=10, decimal_places=0, default=200000)
    maintenance_mode = models.BooleanField(default=False)
    
    # Social links
    instagram_url = models.URLField(blank=True)
    tiktok_url = models.URLField(blank=True)

    def save(self, *args, **kwargs):
        if not self.pk and StoreSettings.objects.exists():
            # If you try to save a new instance while one exists, prevent it or update existing
            return
        return super(StoreSettings, self).save(*args, **kwargs)

    def __str__(self):
        return "Store Settings"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
