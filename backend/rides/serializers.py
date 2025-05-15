from rest_framework import serializers
from .models import Ride, PassengerRequest

class RideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ride
        fields = '__all__'
        read_only_fields = ['driver', 'created_at']


class PassengerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PassengerRequest
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'status']