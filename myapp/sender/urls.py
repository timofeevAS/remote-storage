from django.urls import path
from .views import FileListView, user_files, FileUpdateView,DepartmentViewList

urlpatterns = [
    path('files/upload_page/', user_files, name='user_files'),
    path('files/', FileListView.as_view(),name='file_list'),
    path('files/<int:pk>/', FileUpdateView.as_view(), name='api-file-delete'),
    path('files/departments',DepartmentViewList.as_view(), name='departments_list')
]


