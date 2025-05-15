from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Ride, PassengerRequest
from .serializers import RideSerializer, PassengerRequestSerializer

# Create your views here.

class CreateRideAPIView(generics.CreateAPIView):
    queryset = Ride.objects.all()
    serializer_class = RideSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(driver=self.request.user)


class RequestToJoinRideAPIView(generics.CreateAPIView):
    queryset = PassengerRequest.objects.all()
    serializer_class = PassengerRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        ride_id = self.request.data.get('ride')
        serializer.save(user=self.request.user, ride_id=ride_id)
