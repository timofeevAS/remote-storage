from django.urls import path
from .views import FileListView, user_files, FileUpdateView,DepartmentViewList, FileListSizeView, FolderView

urlpatterns = [
    path('files/upload_page/', user_files, name='user_files'),
    path('files/', FileListView.as_view(),name='file_list'),
    path('files/<int:pk>/', FileUpdateView.as_view(), name='api-file-delete'),
    path('files/departments',DepartmentViewList.as_view(), name='departments_list'),
    path('files/size/',FileListSizeView.as_view(),name='file-list-size'),
    path('folders/<int:pk>/', FolderView.as_view(), name='folder-detail'),
    path('folders/', FolderView.as_view(), name='folder-interact'),\

]


