from django.urls import path
from .views import FileListView, user_files, FileUpdateView

urlpatterns = [
    path('files/upload_page/', user_files, name='user_files'),
    path('files/', FileListView.as_view(),name='file_list'),
    path('files/<int:pk>/', FileUpdateView.as_view(), name='api-file-delete'),
]
