from django.urls import path
from . import views

urlpatterns = [
    path('', views.ApiRoot.as_view()),

    path('group/', views.GroupView.as_view(), name=views.GroupView.name),
    path('group/<int:pk>', views.GroupDetailView.as_view(), name=views.GroupDetailView.name),

    path('task/', views.TaskView.as_view(), name=views.TaskView.name),
    path('task/<int:pk>', views.TaskDetailView.as_view(), name=views.TaskDetailView.name),

    path('task2/', views.TaskWithGroupView.as_view(), name=views.TaskWithGroupView.name),
    path('task2/<int:pk>', views.TaskWithGroupDetailView.as_view(), name=views.TaskWithGroupDetailView.name),
]
