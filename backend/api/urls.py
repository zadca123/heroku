from django.urls import path
from . import views

urlpatterns = [
    path('group/', views.GroupView.as_view()),
    path('group/<int:pk>/', views.GroupDetailView.as_view()),
    path('task/', views.TaskView.as_view()),
    path('task/<int:pk>/', views.TaskDetailView.as_view()),
    path('', views.GroupTaskView.as_view())
]
