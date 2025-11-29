from rest_framework import serializers
from .models import Product, ProductImage, Collection, Order, OrderItem, StoreSettings, Category

class CategorySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    class Meta:
        model = Category
        fields = ['id', 'name', 'image', 'description']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['image']

class ProductSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    images = serializers.SerializerMethodField()
    # Accept category name as string, handle creation in create/update
    category = serializers.CharField()
    # Allow writing collection by ID (mapped to collectionId)
    collectionId = serializers.PrimaryKeyRelatedField(source='collection', queryset=Collection.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'original_price', 'category', 'collectionId',
            'image', 'images', 'is_new', 'description', 'details',
            'colors', 'sizes', 'in_stock', 'available_sizes'
        ]
        extra_kwargs = {
            'original_price': {'source': 'originalPrice'}, 
        }

    def create(self, validated_data):
        category_name = validated_data.pop('category', None)
        product = Product.objects.create(**validated_data)
        
        if category_name:
            category, _ = Category.objects.get_or_create(name=category_name)
            product.category = category
            product.save()
            
        return product

    def update(self, instance, validated_data):
        category_name = validated_data.pop('category', None)
        
        # Update standard fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        if category_name:
            category, _ = Category.objects.get_or_create(name=category_name)
            instance.category = category
            
        instance.save()
        return instance

    def get_images(self, obj):
        # Return main image + additional images as a list of URLs
        images = [obj.image.url] if obj.image else []
        for img in obj.additional_images.all():
            if img.image:
                images.append(img.image.url)
        return images
    
    def to_representation(self, instance):
        # Convert snake_case to camelCase for frontend compatibility
        data = super().to_representation(instance)
        data['originalPrice'] = data.pop('original_price', None)
        data['isNew'] = data.pop('is_new', None)
        data['inStock'] = data.pop('in_stock', None)
        data['availableSizes'] = data.pop('available_sizes', None)
        return data

class CollectionSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Collection
        fields = ['id', 'title', 'subtitle', 'image', 'category', 'size']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.image and request:
            data['image'] = request.build_absolute_uri(instance.image.url)
        return data

class OrderItemSerializer(serializers.ModelSerializer):
    productId = serializers.PrimaryKeyRelatedField(source='product', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['productId', 'name', 'image', 'price', 'quantity', 'size']

class OrderSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    shippingDetails = serializers.JSONField(source='shipping_details')
    customerName = serializers.CharField(source='customer_name')
    customerEmail = serializers.EmailField(source='customer_email')

    class Meta:
        model = Order
        fields = ['id', 'date', 'status', 'total', 'items', 'customerName', 'customerEmail', 'shippingDetails']

class StoreSettingsSerializer(serializers.ModelSerializer):
    storeName = serializers.CharField(source='store_name')
    supportEmail = serializers.EmailField(source='support_email')
    shippingFlatRate = serializers.DecimalField(source='shipping_flat_rate', max_digits=10, decimal_places=0)
    freeShippingThreshold = serializers.DecimalField(source='free_shipping_threshold', max_digits=10, decimal_places=0)
    maintenanceMode = serializers.BooleanField(source='maintenance_mode')
    socialLinks = serializers.SerializerMethodField()

    class Meta:
        model = StoreSettings
        fields = ['storeName', 'supportEmail', 'currency', 'shippingFlatRate', 'freeShippingThreshold', 'maintenanceMode', 'socialLinks']

    def get_socialLinks(self, obj):
        return {
            'instagram': obj.instagram_url,
            'tiktok': obj.tiktok_url
        }
