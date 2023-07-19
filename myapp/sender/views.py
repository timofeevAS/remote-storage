from django.shortcuts import render
from .models import MyFile
from django.http import HttpResponseRedirect

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.models import User

from .serializers import FileSerializer


def index(request):
    return render(request, 'index.html')


def user_files(request):
    '''
    View render for upload and download files into site.
    '''
    success_message = None
    my_files = MyFile.objects.all()

    if request.method == 'POST':
        file = request.FILES.get('file')

        superuser = User.objects.get(is_superuser=True, username='admin')

        if file:
            try:
                obj, created = MyFile.objects.update_or_create(
                    file=file,
                    name=file.name,
                    size=file.size,
                    owner=superuser)
                success_message = 'Файл загружен'
            except:
                success_message = 'Ошибка загрузки файла'

            # save session and remove post data
            request.session['success_message'] = success_message
            request.POST = request.POST.copy()  # copy data of request
            request.POST.clear()  # clear POST data

            # redirect with PRG ???
            # need to find more about PRG.
            return HttpResponseRedirect(request.path_info)

    # get session status from request
    if 'success_message' in request.session:
        success_message = request.session.pop('success_message')

    return render(request, 'files.html', {'success_message': success_message, 'files': my_files})


class FileListView(APIView):
    '''
    GET method for filelist
    '''

    def get(self, request):
        files = MyFile.objects.all()
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
