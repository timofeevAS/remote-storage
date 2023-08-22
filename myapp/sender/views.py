import re
import datetime, pytz

from django.db.models import Q
from django.shortcuts import render

from .forms import FileUploadForm
from .models import *
from django.http import HttpResponseRedirect, Http404

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

    def date_convert(self, date):
        # Convert str to int by year month day
        year = int(date[:4])
        month = int(date[5:7])
        day = int(date[8:10])

        # Convert to datetime for compare with DB
        converted_date = datetime.datetime(year, month, day, tzinfo=pytz.UTC)

        return converted_date
    def get_object_by_pk(self, MyModel, pk):
        try:
            return MyModel.objects.get(pk=pk)
        except MyModel.DoesNotExist:
            return Response({'error': f'Current item doesn\'t exists {MyModel.__class__.__name__}'},
                            status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        # All files
        files = MyFile.objects.all()

        # Get params from request
        department_param = request.GET.get('department', None)
        search_name = request.GET.get('search', None)
        upload_date_from = request.GET.get('uploadDateFrom', None)
        upload_date_to = request.GET.get('uploadDateTo', None)
        extensions = request.GET.get('selectedFileType', None)

        # Match department from params
        if department_param is not None:
            try:
                department = Department(Department.objects.get(name=department_param))
            except Department.DoesNotExist:
                return Response({'error': f'Current department doesn\'t exists ({department_param})'})
            files = files.filter(department=department.pk)

        # Match files with name from param
        if search_name is not None:
            search_regex = re.compile(f".*{re.escape(search_name)}.*", re.IGNORECASE)
            q_objects = Q()  # Empty Q-object

            for file in files:
                if search_regex.match(file.name):
                    q_objects |= Q(pk=file.pk)  # Conditions for correct files

            files = files.filter(q_objects)  # Filter QuerySet

        # Match files with upload date
        if upload_date_from is not None:
            upload_date_from = self.date_convert(upload_date_from)
            files = files.filter(created_at__gte=upload_date_from)

        if upload_date_to is not None:
            upload_date_to = self.date_convert(upload_date_to)
            files = files.filter(created_at__lte=upload_date_to)

        # Match files with extensions
        if extensions is not None:
            extensions = tuple(extensions.split(','))
            q_objects = Q()  # Empty Q-object

            # Filter files with extension from params
            for file in files:
                if str(file.name).endswith(extensions):
                    q_objects |= Q(pk=file.pk)

            files = files.filter(q_objects)

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


class FileUpdateSerializer(serializers.ModelSerializer):
    """
    FILE Update serializer
    """

    def update(self, instance, validated_data):
        extension = instance.name.split('.')[-1] if '.' in instance.name else ''
        new_name = f"{validated_data['name']}.{extension}"
        instance.name = new_name
        instance.save()
        return instance

    class Meta:
        model = MyFile
        fields = ['name']


class FileUpdateView(APIView):
    '''
    FILE Update view.
    '''

    def get_object(self, pk):
        try:
            return MyFile.objects.get(pk=pk)
        except MyFile.DoesNotExist:
            raise Http404

    def delete(self, request, pk):
        file = self.get_object(pk)
        file.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk):
        file = self.get_object(pk)
        serializer = FileUpdateSerializer(file, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
