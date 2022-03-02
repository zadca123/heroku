from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.reverse import reverse

from .models import Group, Task
from .serializers import GroupSerializer, TaskSerializer, TaskWithGroupSerializer


class GroupView(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    name = 'group-list'


class GroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    name = 'group-detail'


class TaskView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    name = 'task-list'


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    name = 'task-detail'


class TaskWithGroupView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskWithGroupSerializer
    name = 'taskWithGroup-list'


class TaskWithGroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskWithGroupSerializer
    name = 'taskWithGroup-detail'


class ApiRoot(generics.GenericAPIView):
    name = 'api-root'

    def get(self, request, *args, **kwargs):
        return Response({
            'GroupView': reverse(GroupView.name, request=request),
            'TaskView': reverse(TaskView.name, request=request),
            'TaskWithGroupView': reverse(TaskWithGroupView.name, request=request)
        })
