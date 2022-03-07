from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from . import views
from .models import Group, Task


class GroupTests(APITestCase):
    def post_group(self, name, limit):
        url = reverse(views.GroupView.name)
        data = {
            'name': name,
            'limit': limit,
        }
        response = self.client.post(url, data, format='json')
        return response

    def test_post_and_get_group(self):
        new_group_name = 'ToDo'
        new_group_limit = 0
        response = self.post_group(new_group_name, new_group_limit)
        print("PK {0}".format(Group.objects.get().pk))
        assert response.status_code == status.HTTP_201_CREATED
        assert Group.objects.count() == 1
        assert Group.objects.get().name == new_group_name
        assert Group.objects.get().limit == new_group_limit

    def test_post_existing_group_name(self):
        new_species_name = 'ToDo'
        new_species_limit = 0
        response_one = self.post_group(new_species_name, new_species_limit)
        assert response_one.status_code == status.HTTP_201_CREATED
        response_two = self.post_group(new_species_name, new_species_limit)
        print(response_two)
        assert response_two.status_code == status.HTTP_400_BAD_REQUEST


# class TaskTests(APITestCase):
#     def post_group(self):
#         url = reverse(views.GroupView.name)
#         data = {
#             'name': 'ToDo',
#             'limit': 0,
#         }
#         return self.client.post(url, data, format='json')
#
#     def post_task(self, title, description, group):
#         url = reverse(views.TaskView.name)
#         data = {
#             "title": title,
#             "description": description,
#             "group": group
#         }
#         response = self.client.post(url, data, format='json')
#         return response
#
#     def test_post_and_get_task(self):
#         new_task_title = "Task"
#         new_task_desc = "desc"
#         group = self.post_group()
#         response = self.post_task(new_task_title, new_task_desc, group)
#         assert response.status_code == status.HTTP_201_CREATED
#         assert Task.objects.count() == 1
#         assert Task.objects.get().title == new_task_title
#         assert Task.objects.get().description == new_task_desc
#         assert Task.objects.get().group == group
#
#
