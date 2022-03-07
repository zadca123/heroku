from rest_framework import serializers
from .models import Group, Task


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'id', 'name', 'limit']


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['url', 'id', 'title', 'description', 'group']


class TaskExpendedSerializer(serializers.ModelSerializer):
    group = GroupSerializer()

    class Meta:
        model = Task
        fields = ['url', 'id', 'title', 'description', 'group']


class GroupTaskSerializer(serializers.ModelSerializer):
    task_set = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ['url', 'id', 'name', 'limit', 'task_set']
