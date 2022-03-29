from django.contrib import admin
from .models import Column, Row, Task, Limit, User, TaskUser

admin.site.register(Column)
admin.site.register(Row)
admin.site.register(Task)
admin.site.register(Limit)
admin.site.register(User)
admin.site.register(TaskUser)
