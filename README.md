# Remote-storage
This project implement storaging (local yet) files with Django 4.1.

## Installation
To install and run project open terminal:

Set up virtual enviroment:
```commandline
python -m venv .venv
```
Activate .venv with `./.venv/Scripts/activate`

Set up requirements:
```commandline
pip install -r requirements.txt
```

```
python manage.py makemigrations
python manage.py migrate
python manage.py data_gen
python manage.py runserver
```

## To manage frontend:
1. Install Node.js `https://nodejs.org/ru`
```
npm run dev
```

http://localhost:8000 - your site available
http://localhost:8000/users/files/upload_page - your docs page