from django.shortcuts import render

from .forms import FileUploadForm
from .models import *
from django.http import HttpResponseRedirect

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers

from django.contrib.auth.models import User


def user_files(request):
    """
    View render for upload and download files into site.
    """
    success_message = None
    my_files = MyFile.objects.all()
    form = FileUploadForm()
    if request.method == 'POST':
        form = FileUploadForm(request.POST, request.FILES)

        superuser = User.objects.get(is_superuser=True, username='admin')

        if form.is_valid():
            file = request.FILES.get('file')
            try:
                obj, created = MyFile.objects.update_or_create(
                    file=file,
                    name=file.name,
                    size=file.size,
                    owner=superuser)
                success_message = 'Файл загружен'
            except:
                success_message = 'Ошибка загрузки файла'
        else:
            success_message = form.errors['file']

            # Save session and remove post data
            request.session['success_message'] = success_message
            request.POST = request.POST.copy()  # Copy data of request
            request.POST.clear()  # Clear POST data

            # Redirect with PRG ???
            # Need to find more about PRG.
            return HttpResponseRedirect(request.path_info)

    # Get session status from request
    if 'success_message' in request.session:
        success_message = request.session.pop('success_message')

    return render(request, 'files.html', {'success_message': success_message, 'files': my_files, 'form': form})


class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer for Task model
    """

    class Meta:
        model = Task
        fields = ['id', 'name', 'owner']


class OwnerSerializer(serializers.ModelSerializer):
    """
    Serializer for Owner or User
    """

    class Meta:
        model = User
        fields = ['id', 'username']


class FileListSerializer(serializers.ModelSerializer):
    """
    Serializer for file listing
    """
    extension = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    task = TaskSerializer()
    owner = OwnerSerializer()

    def get_extension(self, obj):
        return obj.name.split('.')[-1] if '.' in obj.name else ''

    def get_name(self, obj):
        return obj.name.split('.')[0] if '.' in obj.name else ''

    def get_url(self, obj):
        return obj.file.url

    class Meta:
        model = MyFile
        fields = ['id', 'name', 'extension', 'url', 'size', 'view_amount', 'created_at', 'owner', 'task']


class FileUploadSerializer(serializers.ModelSerializer):
    """
    Upload file serializer
    """

    class Meta:
        model = MyFile
        fields = ['file', 'name']

    def create(self, validated_data):
        superuser = User.objects.get(is_superuser=True, username='admin')
        name = validated_data.get('name')

        if name == '':
            if 'file' in validated_data:
                name = validated_data['file'].name
            else:
                raise serializers.ValidationError('File name is required.')
        else:
            extension = validated_data['file'].name.split('.')[-1] if '.' in validated_data['file'].name else ''
            name = validated_data.get('name') + '.' + extension

        try:
            my_file = MyFile.objects.create(
                name=name,
                file=validated_data['file'],
                owner=superuser,
                size=validated_data['file'].size,
            )
        except:
            raise serializers.ValidationError('Can\'t create file')

        return my_file


class FileListView(APIView):
    """
    View for filelist
    """

    def get(self, request):
        files = MyFile.objects.all()

        department_param = request.GET.get('department', None)

        if department_param is not None:
            try:
                department_id = Department.objects.get(name=department_param)
            except:
                return Response({'error': 'Current department doesn\'t exist'}, status=status.HTTP_400_BAD_REQUEST)
            files = files.filter(department=department_id)

        serializer = FileListSerializer(files, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = FileUploadSerializer(data=request.data)
        print(request.data['name'])
        if serializer.is_valid():
            my_file = serializer.save()
            return Response({'message': 'File uploaded successfully.', 'file_id': my_file.id},
                            status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FileDeleteView(APIView):
    '''
    FILE Delete view.
    '''

    def delete(self, request, pk):
        try:
            file = MyFile.objects.get(pk=pk)
            file.delete()
            return Response(status=status.HTTP_200_OK)
        except MyFile.DoesNotExist:
            return Response(body={'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)
