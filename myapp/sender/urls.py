from django.urls import path
from .views import user_files

urlpatterns = [
    path('files/', user_files, name='user_files'),
]
