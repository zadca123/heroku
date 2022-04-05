# syntax=docker/dockerfile:1
FROM python:3
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
# RUN python manage.py makemigrations
# RUN python manage.py migrate
# EXPOSE 3000
CMD ["python", "manage.py", "runserver"]
# CMD ["./wait.sh"]
