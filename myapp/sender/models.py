from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class MyFile(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='media/')
    owner = models.ForeignKey(to=User,on_delete=models.CASCADE)
    size = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    view_amount = models.PositiveIntegerField(default=0)