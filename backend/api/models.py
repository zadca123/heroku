from django.db import models

class Group(models.Model):
    name = models.CharField(unique=True, max_length=50)
    limit = models.IntegerField(default=0)
    position = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['position']

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(default='')
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    position = models.IntegerField(default=0)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['position']
