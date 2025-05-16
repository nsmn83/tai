from rest_framework import serializers
from .models import Ride, PassengerRequest
from django.contrib.auth import get_user_model
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class PassengerRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = PassengerRequest
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'status']

class RideSerializer(serializers.ModelSerializer):
    driver = serializers.SerializerMethodField()
    requests = PassengerRequestSerializer(many=True, read_only=True)

    class Meta:
        model = Ride
        fields = '__all__'

    def get_driver(self, obj):
        return {
            "id": obj.driver.id,
            "username": obj.driver.username,
            "email": obj.driver.email,
        }

