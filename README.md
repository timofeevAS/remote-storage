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
cd .\myapp\
pip install -r requirements.txt
```

```
python manage.py makemigrations sender
python manage.py migrate
python manage.py createsuperuser
python manage.py data_gen
```

## To manage frontend:
1. Install Node.js `https://nodejs.org`
```
cd .\myapp\
npm install
```
After agree with other installings.

```
npm run dev
```

## Let's launch:
Open new terminal, after this type:
```commandline
python manage.py runserver
```
http://localhost:8000 - your site available
http://localhost:8000/users/files/upload_page - your docs page