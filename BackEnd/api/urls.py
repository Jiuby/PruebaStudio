from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CollectionViewSet, OrderViewSet, StoreSettingsViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'collections', CollectionViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'settings', StoreSettingsViewSet, basename='settings')

urlpatterns = [
    path('', include(router.urls)),
]
