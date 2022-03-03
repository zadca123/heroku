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

class AllSerializer(serializers.ModelSerializer):
    group = GroupSerializer()
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'group']