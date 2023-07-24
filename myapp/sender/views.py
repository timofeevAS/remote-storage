from django.shortcuts import render

from .forms import FileUploadForm
from .models import MyFile
from django.http import HttpResponseRedirect

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.models import User

from .serializers import FileSerializer

def user_files(request):
    '''
    View render for upload and download files into site.
    '''
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

    return render(request, 'files.html', {'success_message': success_message, 'files': my_files,'form':form})


class FileListView(APIView):
    '''
    GET method for filelist
    '''

    def get(self, request):
        files = MyFile.objects.all()
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)