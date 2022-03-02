from rest_framework import serializers
from .models import Group, Task


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'id', 'name', 'limit']


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['url', 'id', 'description', 'group']


class TaskWithGroupSerializer(serializers.ModelSerializer):
    group = GroupSerializer()

    class Meta:
        model = Task
        fields = ['url', 'id', 'description', 'group']
