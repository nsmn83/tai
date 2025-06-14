from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# Create your models here.

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    bio = models.TextField(blank=True, null=True)

    profile_image_url = models.URLField(
        default="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        blank=True,
        null=True
    )

    def __string__(self) -> str:
        return self.email


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    body = models.TextField()

    def __str__(self):
        return f"Profile of {self.user.email}"