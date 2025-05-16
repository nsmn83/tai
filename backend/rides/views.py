from django.shortcuts import render
from django.shortcuts import render
from rest_framework import generics, permissions,  serializers, viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.views import APIView
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

from .models import Ride, PassengerRequest
from .serializers import RideSerializer, PassengerRequestSerializer
# Create your views here.

class CreateRideAPIView(generics.CreateAPIView):
    queryset = Ride.objects.all()
    serializer_class = RideSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        start_address = self.request.data.get('start_address')
        end_address = self.request.data.get('end_address')

        start_coords = self.geocode_address(start_address)
        if not start_coords:
            raise serializers.ValidationError("Nie można znaleźć lokalizacji początkowej.")

        end_coords = self.geocode_address(end_address)
        if not end_coords:
            raise serializers.ValidationError("Nie można znaleźć lokalizacji końcowej.")

        serializer.save(
            driver=self.request.user,
            start_lat=start_coords[0],
            start_lng=start_coords[1],
            end_lat=end_coords[0],
            end_lng=end_coords[1],
        )

    def geocode_address(self, address):
        geolocation = Nominatim(user_agent="myGeocoder")
        try:
            location = geolocation.geocode(address + ", Poland")
            if location:
                return location.latitude, location.longitude
            else:
                raise serializers.ValidationError("Nie można znaleźć lokalizacji.")
        except GeocoderTimedOut:
            raise serializers.ValidationError("Przekroczono limit czasu geokodowania.")


class RequestToJoinRideAPIView(generics.CreateAPIView):
    queryset = PassengerRequest.objects.all()
    serializer_class = PassengerRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        ride_id = self.request.data.get('ride')
        ride = Ride.objects.get(id=ride_id)

        if ride.driver == self.request.user:
            raise serializers.ValidationError("Nie możesz dołączyć do swojego własnego przejazdu.")

        serializer.save(user=self.request.user, ride_id=ride_id)

class RideDetailAPIView(generics.RetrieveAPIView):
    queryset = Ride.objects.all()
    serializer_class = RideSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def MyRidesAPIView(request):
    user = request.user

    #rides where the logged in user is driver
    rides_as_driver = Ride.objects.filter(driver=user)

    #rides where user sent requests
    rides_as_passenger = Ride.objects.filter(requests__user=user)

    #all rides needed
    all_rides = (rides_as_passenger | rides_as_driver).distinct().order_by('start_time')

    serializer = RideSerializer(all_rides, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def AllRidesAPIView(request):
    all_rides = Ride.objects.all().order_by('start_time')
    serializer = RideSerializer(all_rides, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def RidesUserRequestedAPIView(request):
    user = request.user
    # Get all passenger requests made by the user, including related ride
    requests = PassengerRequest.objects.filter(user=user).select_related('ride')

    data = []
    for req in requests:
        ride_data = RideSerializer(req.ride).data
        ride_data['request_status'] = req.status  # inject the status
        data.append(ride_data)

    return Response(data)


class AcceptPassengerRequestAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            pr = PassengerRequest.objects.get(pk=pk)
        except PassengerRequest.DoesNotExist:
            return Response({'detail': 'Nie znaleziono żądania.'}, status=status.HTTP_404_NOT_FOUND)

        if pr.ride.driver != request.user:
            return Response({'detail': 'Brak uprawnień.'}, status=status.HTTP_403_FORBIDDEN)

        pr.status = 'accepted'
        pr.save()
        return Response({'status': 'accepted'})


class RejectPassengerRequestAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            pr = PassengerRequest.objects.get(pk=pk)
        except PassengerRequest.DoesNotExist:
            return Response({'detail': 'Nie znaleziono żądania.'}, status=status.HTTP_404_NOT_FOUND)

        if pr.ride.driver != request.user:
            return Response({'detail': 'Brak uprawnień.'}, status=status.HTTP_403_FORBIDDEN)

        pr.status = 'rejected'
        pr.save()
        return Response({'status': 'rejected'})