from django.db import models
from django.contrib.auth.models import User
from django.db.models import FileField
from django.forms import forms
from django.template.defaultfilters import filesizeformat
from django.utils.translation import gettext_lazy as _


class ContentTypeRestrictedFileField(FileField):
    """
    Same as FileField, but you can specify:
        * content_types - list containing allowed content_types. Example: ['application/pdf', 'image/jpeg']
        * max_upload_size - a number indicating the maximum file size allowed for upload.
            2.5MB - 2621440
            5MB - 5242880
            10MB - 10485760
            20MB - 20971520
            50MB - 5242880
            100MB - 104857600
            250MB - 214958080
            500MB - 429916160
    """

    def __init__(self, *args, **kwargs):
        self.content_types = kwargs.pop("content_types", [])
        self.max_upload_size = kwargs.pop("max_upload_size", 0)

        super(ContentTypeRestrictedFileField, self).__init__(*args, **kwargs)

    def clean(self, *args, **kwargs):
        data = super(ContentTypeRestrictedFileField, self).clean(*args, **kwargs)
        file = data.file
        try:
            content_type = file.content_type
            if content_type in self.content_types:
                if file.size > self.max_upload_size:
                    raise forms.ValidationError(_('Please keep filesize under %s. Current filesize %s') % (
                        filesizeformat(self.max_upload_size), filesizeformat(file.size)))
            else:
                raise forms.ValidationError(_('Filetype not supported.'))
        except AttributeError:
            pass
        return data


# Create your models here.

class Task(models.Model):
    owner = models.ForeignKey(to=User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

class Department(models.Model):
    name = models.CharField(max_length=50)
    chief = models.ForeignKey(to=User, on_delete=models.CASCADE)


class MyFile(models.Model):
    name = models.CharField(max_length=255)
    file = ContentTypeRestrictedFileField(upload_to='media/',
                                          content_types=['application/pdf',
                                                         'application/txt',
                                                         'video/mp4',
                                                         'image/jpg'],
                                          max_upload_size=5242880)
    owner = models.ForeignKey(to=User, on_delete=models.CASCADE)
    size = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    view_amount = models.PositiveIntegerField(default=0)
    task = models.ForeignKey(to=Task, on_delete=models.CASCADE,null=True)
    department = models.ForeignKey(to=Department, on_delete=models.CASCADE,null=True)



