from django.db import models


class Group(models.Model):
    name = models.CharField(max_length=50, unique=True)
    limit = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(default='')
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
