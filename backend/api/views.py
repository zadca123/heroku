from django.shortcuts import render
from rest_framework import generics, status
from .models import Group, Task
from .serializers import GroupSerializer, TaskSerializer, GroupTaskSerializer
from django.http import HttpResponse

class GroupView(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class GroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class TaskView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class GroupTaskView(generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupTaskSerializer
