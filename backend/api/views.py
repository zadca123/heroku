from django.shortcuts import render
from rest_framework import generics
from .models import Group, Task
from .serializers import GroupSerializer, TaskSerializer, TaskWithGroupSerializer

class GroupView(generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class TaskView(generics.ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskWithGroupView(generics.ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskWithGroupSerializer

class AllView(generics.ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
