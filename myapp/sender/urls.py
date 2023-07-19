from django.urls import path
from .views import FileListView, user_files, index

urlpatterns = [
    path('files/upload_page/', user_files, name='user_files'),
    path('files/', FileListView.as_view(),name='file_list'),
    path('', index, name='index-url'),
]
