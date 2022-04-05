#!/bin/sh

# while ! nc -z db 3306 ; do
#     echo "Waiting for the MySQL Server"
#     sleep 3
# done
sleep 20
python manage.py runserver 0.0.0.0:8000
