from django.shortcuts import render
from rest_framework import generics, status
from .models import Column, Row, Task, Limit, User, TaskUser
from .serializers import ColumnSerializer, RowSerializer, TaskSerializer, LimitSerializer, UserSerializer, TaskUserSerializer
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


class UserView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TaskUserView(generics.ListCreateAPIView):
    queryset = TaskUser.objects.all()
    serializer_class = TaskUserSerializer

class TaskUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskUser.objects.all()
    serializer_class = TaskUserSerializer

'''
class GroupTaskView(generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupTaskSerializer
'''
