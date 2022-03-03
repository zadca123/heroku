from django.urls import path
from . import views

urlpatterns = [
    path('', views.ApiRoot.as_view()),

    path('group/', views.GroupView.as_view(), name=views.GroupView.name),
    path('group/<int:pk>', views.GroupDetailView.as_view(), name=views.GroupDetailView.name),

    path('task/', views.TaskView.as_view(), name=views.TaskView.name),
    path('task/<int:pk>', views.TaskDetailView.as_view(), name=views.TaskDetailView.name),

    path('taskExpended/', views.TaskExpendedView.as_view(), name=views.TaskExpendedView.name),
    path('taskExpended/<int:pk>', views.TaskExpendedDetailView.as_view(), name=views.TaskExpendedDetailView.name),
]
