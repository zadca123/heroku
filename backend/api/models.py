from django.db import models

class Column(models.Model):
    name = models.CharField(unique=True, max_length=50)
    position = models.IntegerField(default=0)
    limit = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['position']

class Row(models.Model):
    name = models.CharField(unique=True, max_length=50)
    position = models.IntegerField(default=0)
    limit = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['position']

class Task(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(default='')
    position = models.IntegerField(default=0)
    column = models.ForeignKey(Column, on_delete=models.CASCADE)
    row = models.ForeignKey(Row, on_delete=models.CASCADE)
    

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['position']

class Limit(models.Model):
    limit = models.IntegerField(default=0)
    column = models.ForeignKey(Column, on_delete=models.CASCADE, related_name='limit_column')
    row = models.ForeignKey(Row, on_delete=models.CASCADE, related_name='limit_row')

    def __str__(self):
        return 'Column ' + self.column.name + ', Row ' + self.row.name + ', Limit ' + str(self.limit)
