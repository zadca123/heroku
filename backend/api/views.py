from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.reverse import reverse

from .models import Group, Task
from .serializers import GroupSerializer, TaskSerializer, TaskExpendedSerializer, GroupTaskSerializer


class GroupView(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    name = 'group-list'
    filterset_fields = ['name']
    search_fields = ['name']
    ordering_fields = ['id', 'name']


class GroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    name = 'group-detail'


class TaskView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    name = 'task-list'
    filterset_fields = ['title']
    search_fields = ['title']
    ordering_fields = ['id', 'title', 'group']



class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    name = 'task-detail'


class TaskExpendedView(generics.ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskExpendedSerializer
    name = 'taskExpended-list'
    filterset_fields = ['title']
    search_fields = ['title']
    ordering_fields = ['id', 'title', 'group']


class TaskExpendedDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskExpendedSerializer
    name = 'taskExpended-detail'



class GroupTaskView(generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupTaskSerializer
    name = 'groupTasks-list'
    filterset_fields = ['name']
    search_fields = ['name']
    ordering_fields = ['id', 'name']


class ApiRoot(generics.GenericAPIView):
    name = 'api-root'

    def get(self, request, *args, **kwargs):
        return Response({
            'GroupView': reverse(GroupView.name, request=request),
            'TaskView': reverse(TaskView.name, request=request),
            'TaskExpendedView': reverse(TaskExpendedView.name, request=request),
            'GroupTasksView': reverse(GroupTaskView.name, request=request)
        })

