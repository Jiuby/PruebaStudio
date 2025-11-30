from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
import re
from .models import Product, ProductImage, Collection, Order, OrderItem, StoreSettings, Category, UserProfile

# ===== Authentication Serializers =====

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone', 'address', 'city', 'postal_code']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile', 'date_joined', 'is_staff']
        read_only_fields = ['id', 'date_joined', 'is_staff']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value
    
    def validate(self, data):
        # Validate password match
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        
        # Validate password strength: minimum 5 characters and at least 2 numbers
        password = data['password']
        if len(password) < 5:
            raise serializers.ValidationError({"password": "Password must be at least 5 characters long."})
        
        # Count numbers in password
        numbers = re.findall(r'\d', password)
        if len(numbers) < 2:
            raise serializers.ValidationError({"password": "Password must contain at least 2 numbers."})
        
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')  # Remove password_confirm before creating user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        # Create associated UserProfile
        UserProfile.objects.create(user=user)
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        # Find user by email
        try:
            user = User.objects.get(email=email)
            username = user.username
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")
        
        # Authenticate
        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password.")
        
        data['user'] = user
        return data

# ===== Product & Store Serializers =====


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
    # Collection handling: read the ID, write by ID
    collectionId = serializers.PrimaryKeyRelatedField(
        source='collection', 
        queryset=Collection.objects.all(), 
        required=False, 
        allow_null=True
    )
    # Accept camelCase fields from frontend
    originalPrice = serializers.DecimalField(source='original_price', max_digits=10, decimal_places=0, required=False, allow_null=True, write_only=True)
    isNew = serializers.BooleanField(source='is_new', required=False, write_only=True)
    inStock = serializers.BooleanField(source='in_stock', required=False, write_only=True)
    availableSizes = serializers.JSONField(source='available_sizes', required=False, write_only=True)
    secondaryImage = serializers.ImageField(source='secondary_image', required=False, allow_null=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'originalPrice', 'category', 'collectionId',
            'image', 'secondaryImage', 'images', 'isNew', 'description', 'details',
            'colors', 'sizes', 'inStock', 'availableSizes'
        ]
    
    def to_representation(self, instance):
        """Override to ensure collectionId is always an integer ID or null"""
        representation = super().to_representation(instance)
        # Ensure collectionId is the numeric ID
        if instance.collection:
            representation['collectionId'] = instance.collection.id
        else:
            representation['collectionId'] = None
        return representation

    def create(self, validated_data):
        import json
        category_name = validated_data.pop('category', None)
        
        # Parse JSON fields if they come as strings (from FormData)
        request = self.context.get('request')
        if request and hasattr(request, 'data'):
            for field in ['colors', 'details', 'sizes', 'availableSizes']:
                if field in request.data and isinstance(request.data[field], str):
                    try:
                        validated_data[field] = json.loads(request.data[field])
                    except:
                        pass
        
        # Get gallery images from request
        gallery_images = []
        if request and hasattr(request, 'FILES'):
            for i in range(1, 5):  # gallery_1, gallery_2, gallery_3, gallery_4
                img = request.FILES.get(f'gallery_{i}')
                if img:
                    gallery_images.append(img)
        
        product = Product.objects.create(**validated_data)
        
        if category_name:
            category, _ = Category.objects.get_or_create(name=category_name)
            product.category = category
            product.save()
        
        # Create ProductImage objects for gallery
        for gallery_img in gallery_images:
            ProductImage.objects.create(product=product, image=gallery_img)
            
        return product

    def update(self, instance, validated_data):
        import json
        category_name = validated_data.pop('category', None)
        
        # Parse JSON fields if they come as strings (from FormData)
        request = self.context.get('request')
        if request and hasattr(request, 'data'):
            for field in ['colors', 'details', 'sizes', 'availableSizes']:
                if field in request.data and isinstance(request.data[field], str):
                    try:
                        validated_data[field] = json.loads(request.data[field])
                    except:
                        pass
        
        # Get gallery images from request
        if request and hasattr(request, 'FILES'):
            gallery_images = []
            for i in range(1, 5):  # gallery_1, gallery_2, gallery_3, gallery_4
                img = request.FILES.get(f'gallery_{i}')
                if img:
                    gallery_images.append(img)
            
            # Only update gallery if new images provided
            if gallery_images:
                # Delete old gallery images
                instance.additional_images.all().delete()
                # Create new ones
                for gallery_img in gallery_images:
                    ProductImage.objects.create(product=instance, image=gallery_img)
        
        # Update standard fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        if category_name:
            category, _ = Category.objects.get_or_create(name=category_name)
            instance.category = category
            
        instance.save()
        return instance

    def get_images(self, obj):
        # Return main image + ALL gallery images
        request = self.context.get('request')
        images = []
        
        # Add main image first
        if obj.image:
            images.append(request.build_absolute_uri(obj.image.url) if request else obj.image.url)
        
        # Add all gallery images from ProductImage
        for img in obj.additional_images.all():
            if img.image:
                images.append(request.build_absolute_uri(img.image.url) if request else img.image.url)
            
        return images
    
    def to_representation(self, instance):
        # Convert snake_case to camelCase for frontend compatibility
        data = super().to_representation(instance)
        data['originalPrice'] = instance.original_price
        data['isNew'] = instance.is_new
        data['inStock'] = instance.in_stock
        data['availableSizes'] = instance.available_sizes
        
        # Handle image URLs - always provide absolute URLs
        request = self.context.get('request')
        if instance.image:
            if request:
                data['image'] = request.build_absolute_uri(instance.image.url)
            else:
                data['image'] = instance.image.url
                
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
    productId = serializers.PrimaryKeyRelatedField(
        source='product', 
        queryset=Product.objects.all(),
        required=False,
        allow_null=True
    )
    image = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = OrderItem
        fields = ['productId', 'name', 'image', 'price', 'quantity', 'size', 'color']

class OrderSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    items = OrderItemSerializer(many=True)
    shippingDetails = serializers.JSONField(source='shipping_details')
    customerName = serializers.CharField(source='customer_name')
    customerEmail = serializers.EmailField(source='customer_email')

    class Meta:
        model = Order
        fields = ['id', 'date', 'status', 'total', 'items', 'customerName', 'customerEmail', 'shippingDetails']
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        # Create order items
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        return order

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
