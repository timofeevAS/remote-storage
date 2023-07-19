from django import forms

from django.core.exceptions import ValidationError

def validate_file_size(value):
    mb_limit = 5
    limit = mb_limit * 1024 * 1024  # Ограничение размера файла: 10 МБ
    if value.size > limit:
        raise ValidationError(f'Максимальный размер файла должен быть не более {mb_limit} байт.')
class FileUploadForm(forms.Form):
    file = forms.FileField(validators=[validate_file_size])