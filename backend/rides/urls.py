from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('rides/create/', CreateRideAPIView.as_view(), name='create-ride'),
    path('rides/join/', RequestToJoinRideAPIView.as_view(), name='join-ride'),
]
