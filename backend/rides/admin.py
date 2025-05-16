from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Ride, PassengerRequest

admin.site.register(Ride)
admin.site.register(PassengerRequest)