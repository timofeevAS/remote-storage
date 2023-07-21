from rest_framework import serializers
from .models import MyFile

class FileSerializer(serializers.ModelSerializer):
    '''
    Serializer for file listing
    '''
    extension = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    def get_extension(self, obj):
        return obj.name.split('.')[-1] if '.' in obj.name else ''

    def get_name(self,obj):
        return obj.name.split('.')[0] if '.' in obj.name else ''

    def get_url(self,obj):
        return obj.file.url

    class Meta:
        model = MyFile
        fields = ['id','name','extension','url','size','view_amount','created_at','owner']
