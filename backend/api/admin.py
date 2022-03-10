from django.contrib import admin
from .models import Group, Task


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    pass


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    pass
