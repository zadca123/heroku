from django.utils.http import urlencode
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
        new_group_name = 'ToDo'
        new_group_limit = 0
        response_one = self.post_group(new_group_name, new_group_limit)
        assert response_one.status_code == status.HTTP_201_CREATED
        response_two = self.post_group(new_group_name, new_group_limit)
        print(response_two)
        assert response_two.status_code == status.HTTP_400_BAD_REQUEST

    def test_filter_group_by_name(self):
        group_name1 = 'ToDo'
        group_name2 = 'Done'
        self.post_group(group_name1, 0)
        self.post_group(group_name2, 0)
        filter_by_name = {'name': group_name1}
        url = '{0}?{1}'.format(reverse(views.GroupView.name), urlencode(filter_by_name))
        print(url)
        response = self.client.get(url, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
        assert response.data['results'][0]['name'] == group_name1


class TaskTests(APITestCase):
    def post_group(self):
        url = reverse(views.GroupView.name)
        data = {
            'name': 'ToDo',
            'limit': 0,
        }
        return self.client.post(url, data, format='json')

    def post_task(self, title, description, group):
        url = reverse(views.TaskView.name)
        data = {
            "title": title,
            "description": description,
            "group": group
        }
        response = self.client.post(url, data, format='json')
        return response

    def test_post_and_get_task(self):
        new_task_title = "Task"
        new_task_desc = "desc"
        group = self.post_group()
        id_group = group.json()['id']
        response = self.post_task(new_task_title, new_task_desc, id_group)
        assert response.status_code == status.HTTP_201_CREATED
        assert Task.objects.count() and Group.objects.count() == 1
        assert Task.objects.get().title == new_task_title
        assert Task.objects.get().description == new_task_desc
