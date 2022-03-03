from django.shortcuts import render
from rest_framework import generics, status
from .models import Group, Task
from .serializers import GroupSerializer, TaskSerializer, AllSerializer
from django.http import HttpResponse

class GroupView(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class GroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return HttpResponse(status=status.HTTP_200_OK)

class TaskView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    # Zmiana statusu po usunięciu obiektu z HTTP_204_NO_CONTENT na HTTP_200_OK
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return HttpResponse(status=status.HTTP_200_OK)

class AllView(generics.ListAPIView):
    queryset = Task.objects.all()
    serializer_class = AllSerializer
