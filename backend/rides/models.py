from django.db import models
from django.conf import settings

# Create your models here.
class Ride(models.Model):
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
        ('deleted', 'Deleted')
    ]

    start_address = models.CharField(max_length=64)
    end_address = models.CharField(max_length=64)
    start_lat = models.FloatField(null=True, blank=True)
    start_lng = models.FloatField(null=True, blank=True)
    end_lat = models.FloatField(null=True, blank=True)
    end_lng = models.FloatField(null=True, blank=True)
    start_time = models.DateTimeField()
    max_passengers = models.PositiveIntegerField()
    driver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="drives")
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    description =  models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.start_address} -> {self.end_address} ({self.status})"

class PassengerRequest(models.Model):
    STATUS_CHOICES = [
        ('waiting', 'Waiting'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE, related_name='requests')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='waiting')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} -> {self.ride} ({self.status})"