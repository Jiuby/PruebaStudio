from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Product, Collection, Order, StoreSettings, Category
from .serializers import ProductSerializer, CollectionSerializer, OrderSerializer, StoreSettingsSerializer, CategorySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-date')
    serializer_class = OrderSerializer

class StoreSettingsViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for retrieving and updating StoreSettings.
    Since it's a singleton, we don't need standard list/create logic usually.
    """
    def list(self, request):
        settings = StoreSettings.objects.first()
        if not settings:
            # Create default if not exists
            settings = StoreSettings.objects.create()
        serializer = StoreSettingsSerializer(settings)
        return Response(serializer.data)

    def create(self, request):
        # Allow updating via POST/PUT
        settings = StoreSettings.objects.first()
        if not settings:
            settings = StoreSettings.objects.create()
        
        # We might need a custom update logic here because the serializer expects camelCase 
        # but the model is snake_case. The serializer handles source mapping for read, 
        # but for write we need to be careful. 
        # For simplicity in this step, let's assume read-only for now or simple updates.
        # Ideally we'd use a ModelSerializer with proper input mapping.
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
