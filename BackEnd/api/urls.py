from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'products', views.ProductViewSet)
router.register(r'collections', views.CollectionViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'orders', views.OrderViewSet, basename='order') # Explicit basename required due to get_queryset
router.register(r'settings', views.StoreSettingsViewSet, basename='settings')

urlpatterns = [
    path('', include(router.urls)),
    # Authentication endpoints
    path('auth/register/', views.register_view, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/profile/', views.profile_view, name='profile'),
    path('auth/profile/address/', views.update_profile_address, name='update-profile-address'),
    path('auth/users/', views.users_list_view, name='users-list'),
]
