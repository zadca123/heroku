from django.contrib import admin
from .models import Column, Row, Task, Limit

admin.site.register(Column)
admin.site.register(Row)
admin.site.register(Task)
admin.site.register(Limit)
