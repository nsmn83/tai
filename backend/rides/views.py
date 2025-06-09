from django.shortcuts import render
from django.shortcuts import render
from rest_framework import generics, permissions,  serializers, viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.views import APIView
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
from django.utils.dateparse import parse_date

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
    rides_as_passenger = Ride.objects.filter(requests__user=user, requests__status='accepted')

    #all rides needed
    all_rides = (rides_as_passenger | rides_as_driver).exclude(status='deleted').distinct().order_by('start_time')

    serializer = RideSerializer(all_rides, many=True)
    return Response(serializer.data)


from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from django.utils.dateparse import parse_date
from .models import Ride
from .serializers import RideSerializer


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def AllRidesAPIView(request):
    try:
        rides = Ride.objects.exclude(status__in=['done', 'deleted']).order_by('start_time')

        start_address = request.query_params.get('start_address')
        end_address = request.query_params.get('end_address')
        date_str = request.query_params.get('date')

        if start_address:
            rides = rides.filter(start_address__icontains=start_address)

        if end_address:
            rides = rides.filter(end_address__icontains=end_address)

        if date_str:
            date = parse_date(date_str)
            if date:
                rides = rides.filter(start_time__date=date)
            else:
                return Response(
                    {"detail": "Niepoprawny format daty, oczekiwano YYYY-MM-DD."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = RideSerializer(rides, many=True)
        return Response(serializer.data)

    except Exception as e:
        # W przypadku wyjątku zwracamy szczegóły i kod 500
        return Response(
            {"detail": f"Wystąpił błąd serwera: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def RidesUserRequestedAPIView(request):
    user = request.user
    # Pobierz wszystkie prośby użytkownika z powiązanymi przejazdami
    requests = PassengerRequest.objects.filter(user=user).select_related('ride')

    data = []
    for req in requests:
        ride_data = RideSerializer(req.ride).data
        ride_data['request_status'] = req.status  # dodaj status do danych
        data.append(ride_data)

    # Definicja priorytetu statusów
    status_priority = {
        'accepted': 1,
        'waiting': 2,
        'rejected': 3
    }

    # Sortowanie według statusu i daty (od najwcześniejszej)
    data.sort(key=lambda x: (
        status_priority.get(x['request_status'], 3),
        x.get('start_time', None)
    ))

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

class WithdrawPassengerRequestAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            pr = PassengerRequest.objects.get(pk=pk)
            user_id = request.query_params.get('user_id')
        except PassengerRequest.DoesNotExist:
            return Response({'detail': 'Nie znaleziono żądania.'}, status=status.HTTP_404_NOT_FOUND)

        if str(user_id) != str(request.user.id):

            return Response({'detail': 'Brak uprawnień.'}, status=status.HTTP_403_FORBIDDEN)

        pr.status = 'rejected'
        pr.save()
        return Response({'status': 'rejected'})

class DeleteRideAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            rd = Ride.objects.get(pk=pk)
            #pr = PassengerRequest.objects.get(ride = pk)
        except Ride.DoesNotExist:
            return Response({'detail': 'Nie znaleziono żądania.'}, status=status.HTTP_404_NOT_FOUND)

        if rd.driver != request.user:
            return Response({'detail': 'Brak uprawnień.'}, status=status.HTTP_403_FORBIDDEN)

        PassengerRequest.objects.filter(ride=rd).update(status='rejected')
        rd.status = 'deleted'
        rd.save()
        return Response({'status': 'deleted'})

class ProgressRideAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            rd = Ride.objects.get(pk=pk)
               # pr = PassengerRequest.objects.get(ride = pk)
        except Ride.DoesNotExist:
            return Response({'detail': 'Nie znaleziono żądania.'}, status=status.HTTP_404_NOT_FOUND)

        if rd.driver != request.user:
            return Response({'detail': 'Brak uprawnień.'}, status=status.HTTP_403_FORBIDDEN)

        PassengerRequest.objects.filter(ride=rd).update(status='rejected')
        if rd.status == 'planned':
            rd.status = 'in_progress'
            rd.save()
            return Response({'status': 'in_progress'})
        elif rd.status == 'in_progress':
            rd.status = 'done'
            rd.save()
            return Response({'status': 'done'})
        return Response({'status': 'done'})
