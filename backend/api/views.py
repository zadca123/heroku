from django.shortcuts import render
from rest_framework import generics, status
from .models import Column, Row, Task, Limit
from .serializers import ColumnSerializer, RowSerializer, TaskSerializer, LimitSerializer
from django.http import HttpResponse

class ColumnView(generics.ListCreateAPIView):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer

class RowView(generics.ListCreateAPIView):
    queryset = Row.objects.all()
    serializer_class = RowSerializer

class TaskView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class LimitView(generics.ListCreateAPIView):
    queryset = Limit.objects.all()
    serializer_class = LimitSerializer


class ColumnDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer

class RowDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Row.objects.all()
    serializer_class = RowSerializer

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class LimitDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Limit.objects.all()
    serializer_class = LimitSerializer


'''
class GroupTaskView(generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupTaskSerializer
'''
