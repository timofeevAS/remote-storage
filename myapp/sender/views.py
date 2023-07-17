from django.shortcuts import render
from .models import MyFile
from django.http import HttpResponseRedirect

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import FileSerializer

def user_files(request):
    '''
    View render for upload and download files into site.
    '''
    success_message = None
    my_files = MyFile.objects.all()

    if request.method == 'POST':
        file = request.FILES.get('file')

        if file:
            myfile = MyFile(file=file, name=file.name)
            myfile.save()
            success_message = 'Файл загружен'

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
