from django.db import models

# Create your models here.

class MyFile(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='media/')