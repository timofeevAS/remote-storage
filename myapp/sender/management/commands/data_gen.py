import random
import string

from django.core.management.base import BaseCommand
from sender.models import MyFile,User
from django.forms.models import model_to_dict

def random_word(length):
    """
    Getting random string
    """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))


def populate_database(num_entries):
    """
    Filling database
    """
    for _ in range(num_entries):
        parent_file = MyFile.objects.get(name="aaa.txt", id="28")
        random_name = "file_"+random_word(5)+".txt"

        obj, created = MyFile.objects.update_or_create(
            name=random_name,
            owner=parent_file.owner,
            file=parent_file.file,
            size=parent_file.size,
        )

        if created:
            print(f"Created obj:{ obj.name}")


class Command(BaseCommand):
    help = 'Generate and populate data in the database'

    def handle(self, *args, **options):
        num_entries = 50
        populate_database(num_entries)
        self.stdout.write(self.style.SUCCESS('Data generation complete'))
