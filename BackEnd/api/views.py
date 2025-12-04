from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import Product, Collection, Order, StoreSettings, Category, UserProfile
from .permissions import IsAdminOrReadOnly
from .serializers import (
    ProductSerializer, CollectionSerializer, OrderSerializer, 
    StoreSettingsSerializer, CategorySerializer, UserRegistrationSerializer,
    UserLoginSerializer, UserSerializer, UserProfileSerializer
)

# ===== Authentication Views =====

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Register a new user"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Create token for the new user
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(user)
        return Response({
            'token': token.key,
            'user': user_serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login user and return auth token"""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(user)
        return Response({
            'token': token.key,
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Get or update user profile"""
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Update user basic info
        user_data = {
            'first_name': request.data.get('first_name', request.user.first_name),
            'last_name': request.data.get('last_name', request.user.last_name),
        }
        for key, value in user_data.items():
            setattr(request.user, key, value)
        request.user.save()
        
        # Update profile
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        profile_data = request.data.get('profile', {})
        for key in ['phone', 'address', 'city', 'postal_code']:
            if key in profile_data:
                setattr(profile, key, profile_data[key])
        profile.save()
        
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile_address(request):
    """Update user address from checkout"""
    # Get or create profile
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    profile.address = request.data.get('address', profile.address)
    profile.city = request.data.get('city', profile.city)
    profile.postal_code = request.data.get('postal_code', profile.postal_code)
    profile.phone = request.data.get('phone', profile.phone)
    profile.save()
    
    serializer = UserProfileSerializer(profile)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def users_list_view(request):
    """Get list of all users for admin panel"""
    users = User.objects.all().order_by('-date_joined')
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

# ===== Store Views =====


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [IsAdminOrReadOnly]

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    
    def get_permissions(self):
        if self.action == 'create' or self.action == 'track':
            return [AllowAny()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()] # List/Retrieve needs auth (or admin)

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all().order_by('-date')
        if user.is_authenticated:
            return Order.objects.filter(customer_email__iexact=user.email).order_by('-date')
        return Order.objects.none()
    
    def create(self, request, *args, **kwargs):
        # Create the order first
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Check if customer email matches a registered user
        customer_email = order.customer_email
        if customer_email:
            try:
                user = User.objects.get(email=customer_email)
                profile, created = UserProfile.objects.get_or_create(user=user)
                
                # If user has no address saved, assign from shipping details
                if not profile.address and order.shipping_details:
                    shipping = order.shipping_details
                    profile.address = shipping.get('address', '')
                    profile.city = shipping.get('city', '')
                    profile.postal_code = shipping.get('zip', '')
                    profile.phone = shipping.get('phone', '')
                    profile.save()
            except User.DoesNotExist:
                # Customer is not a registered user, skip address assignment
                pass
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def track(self, request):
        """
        Public endpoint to track an order by ID and Email.
        """
        order_id = request.data.get('id')
        email = request.data.get('email')
        
        if not order_id or not email:
            return Response(
                {'error': 'Order ID and Email are required.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            # Case-insensitive email match
            order = Order.objects.get(id=order_id, customer_email__iexact=email)
            serializer = self.get_serializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found or email does not match.'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class StoreSettingsViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for retrieving and updating StoreSettings.
    Since it's a singleton, we don't need standard list/create logic usually.
    """
    def get_permissions(self):
        if self.action == 'list':
            return [AllowAny()]
        return [IsAdminUser()]

    def list(self, request):
        settings = StoreSettings.objects.first()
        if not settings:
            # Create default if not exists
            settings = StoreSettings.objects.create()
        serializer = StoreSettingsSerializer(settings)
        return Response(serializer.data)

    def create(self, request):
        """Update settings via POST"""
        settings = StoreSettings.objects.first()
        if not settings:
            settings = StoreSettings.objects.create()
        
        # Update fields from request
        if 'maintenanceMode' in request.data:
            settings.maintenance_mode = request.data['maintenanceMode']
        if 'shippingFlatRate' in request.data:
            settings.shipping_flat_rate = request.data['shippingFlatRate']
        if 'freeShippingThreshold' in request.data:
            settings.free_shipping_threshold = request.data['freeShippingThreshold']
        
        settings.save()
        serializer = StoreSettingsSerializer(settings)
        return Response(serializer.data)
