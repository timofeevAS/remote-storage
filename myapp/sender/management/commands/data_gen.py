import os
import random
import string

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.core.files import File

from pathlib import Path
from sender.models import MyFile, Task, Department, Folder


def rootfolder():
    """
    Getting root folder
    """
    if not Folder.objects.first():
        folder, created = Folder.objects.update_or_create(
            name='root',
            owner=adminuser(),
        )
        if created:
            print('Create root folder')
            return folder
    else:
        return Folder.objects.first().get_root()

def random_word(length):
    """
    Getting random string
    """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

def adminuser():
    """
    Getting adminuser
    """
    try:
        user_admin = User.objects.all()[0]
    except IndexError:
        print('You need to create a superuser (python manage.py createsuperuser)')
        exit(1)

    return user_admin

def testtask():
    """
    Create or update test task
    """
    test_task, created = Task.objects.update_or_create(
        name='TestTask',
        owner=adminuser(),
    )
    if created:
        print('Created test Task')
    return test_task


def depratments():
    """
    Create or update departments
    """

    storage_deps = []
    names = ['it', 'hr', 'other']

    for name in names:
        dep, created = Department.objects.update_or_create(
            name=name,
            chief=adminuser(),
        )
        storage_deps.append(dep)
    if created:
        print(f'Created dep {name}')
    return storage_deps




def testfile():
    """
    Create or update test file
    """
    try:
        test_file = MyFile.objects.get(name='test.txt')
    except MyFile.DoesNotExist:
        test_file = None

    if test_file:
        print('Using test file from DataBase')
        return test_file

    Path("./media/uploads").mkdir(parents=True, exist_ok=True)
    filepath = './media/uploads/test.txt'

    with open(filepath, 'w+') as file:  # Open file in w+ mode
        django_file = File(file, name='test.txt')
        django_file.write('This file created by smokehappiest')

        test_file, created = MyFile.objects.update_or_create(
            name='test.txt',
            file=django_file,
            task=testtask(),
            defaults={
                'owner': adminuser(),
                'size': os.path.getsize('./media/uploads/test.txt'),
            },
        )
    os.remove(filepath)

    print('Created test file')
    return test_file


def populate_database(num_entries):
    """
    Filling database
    """
    print('drop here')
    root_folder = rootfolder()
    parent_file = testfile()
    departs = depratments()
    task = testtask()

    for _ in range(num_entries):
        random_name = "file_" + random_word(5) + ".txt"
        obj, created = MyFile.objects.update_or_create(
            name=random_name,
            owner=parent_file.owner,
            file=parent_file.file,
            size=parent_file.size,
            department=random.choice(departs),
            task=task
        )
        if created:
            print(f"Created obj:{obj.name}")


class Command(BaseCommand):
    help = 'Generate and populate data in the database'

    def handle(self, *args, **options):
        num_entries = 100
        populate_database(num_entries)

        self.stdout.write(self.style.SUCCESS('Data generation complete'))
