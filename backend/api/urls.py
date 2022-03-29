from django.urls import path
from . import views

urlpatterns = [
    path('column/', views.ColumnView.as_view()),
    path('column/<int:pk>/', views.ColumnDetailView.as_view()),
    path('row/', views.RowView.as_view()),
    path('row/<int:pk>/', views.RowDetailView.as_view()),
    path('task/', views.TaskView.as_view()),
    path('task/<int:pk>/', views.TaskDetailView.as_view()),
    path('limit/', views.LimitView.as_view()),
    path('limit/<int:pk>/', views.LimitDetailView.as_view()),
    path('user/', views.UserView.as_view()),
    path('user/<int:pk>/', views.UserDetailView.as_view()),
    path('taskUser/', views.TaskUserView.as_view()),
    path('taskUser/<int:pk>/', views.TaskUserDetailView.as_view()),
]
