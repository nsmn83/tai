from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('rides/create/', CreateRideAPIView.as_view(), name='create-ride'),
    path('rides/join/', RequestToJoinRideAPIView.as_view(), name='join-ride'),
    path('rides/my/', MyRidesAPIView, name='my_rides'),
    path('rides/all/', AllRidesAPIView, name='all_rides'),
    path('rides/<int:pk>/', RideDetailAPIView.as_view(), name='ride-detail'),
    path('rides/requested/', RidesUserRequestedAPIView, name='rides-requested'),
    path('rides/accept/<int:pk>/', AcceptPassengerRequestAPIView.as_view(), name='accept-passenger-request'),
    path('rides/reject/<int:pk>/', RejectPassengerRequestAPIView.as_view(), name='reject-passenger-request'),

]
