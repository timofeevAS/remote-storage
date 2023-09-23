from django import forms
from django.forms import ModelForm
from .models import MyFile

class FileUploadForm(forms.ModelForm):
    class Meta:
        model = MyFile
        fields = ['file']