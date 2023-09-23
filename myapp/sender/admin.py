from django.contrib import admin
from .models import Task, Department, MyFile, Folder
# Register your models here.
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('owner', 'name')

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'chief')

@admin.register(MyFile)
class MyFileAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'size', 'created_at', 'view_amount', 'task', 'department')
    list_filter = ('owner', 'task', 'department')
    search_fields = ('name', 'owner__username')

@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent')
    list_filter = ('parent',)