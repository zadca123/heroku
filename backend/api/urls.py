from django.urls import path
from . import views

urlpatterns = [
    path('group/', views.GroupView.as_view()),
    path('task/', views.TaskView.as_view()),
    path('task2/', views.TaskWithGroupView.as_view()),
    path('', views.AllView.as_view())
]