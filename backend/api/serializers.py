from rest_framework import serializers
from .models import Group, Task

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'limit']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'group']

class GroupTaskSerializer(serializers.ModelSerializer):
    task_set = TaskSerializer(many=True, read_only=True)
    class Meta:
        model = Group
        fields = ['id', 'name', 'limit', 'task_set']
