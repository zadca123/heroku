from rest_framework import serializers
from .models import Column, Row, Task, Limit, User, TaskUser

class ColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Column
        fields = ['id', 'name', 'position', 'limit']

class RowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Row
        fields = ['id', 'name', 'position', 'limit']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'name', 'description', 'position', 'color', 'column', 'row']

class LimitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Limit
        fields = ['id', 'limit', 'column', 'row']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name']

class TaskUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskUser
        fields = ['id', 'task', 'user']

'''
class GroupTaskSerializer(serializers.ModelSerializer):
    task_set = TaskSerializer(many=True, read_only=True)
    class Meta:
        model = Group
        fields = ['id', 'name', 'limit', 'position', 'task_set']
'''
