# Dokumentacja API
## Grupy z zadaniami
### GET /
```json
[
    {
        "id": 1,
        "name": "Do zrobienia",
        "limit": 0,
        "task_set": [
            {
                "id": 1,
                "title": "Task #1",
                "description": "opis",
                "group": 1
            },
            {
                "id": 3,
                "title": "Task #3",
                "description": "opis",
                "group": 1
            }
        ]
    },
    {
        "id": 2,
        "name": "W trakcie",
        "limit": 1,
        "task_set": [
            {
                "id": 2,
                "title": "Task #2",
                "description": "opis",
                "group": 2
            }
        ]
    },
    {
        "id": 3,
        "name": "Zrobione",
        "limit": 0,
        "task_set": [
            {
                "id": 4,
                "title": "Task #4",
                "description": "opis",
                "group": 3
            }
        ]
    },
    {
        "id": 4,
        "name": "Test task",
        "limit": 3,
        "task_set": []
    }
]
```
## Group
### POST /group/
```json
{
    "name": "Nowa grupa",
    "limit": 0
}
```
### GET /group/
```json
[
    {
        "id": 1,
        "name": "Do zrobienia",
        "limit": 0
    },
    {
        "id": 2,
        "name": "W trakcie",
        "limit": 1
    },
    {
        "id": 3,
        "name": "Zrobione",
        "limit": 0
    }
]
```
### GET /group/{id}/
```json
{
    "id": 2,
    "name": "W trakcie",
    "limit": 1
}
```
### PUT /group/{id}/
```json
{
    "name": "Nowa nazwa",
    "limit": 0
}
```
### DELETE /group/{id}/
## Task
### POST /task/
```json
{
    "description": "Nowe zadanie",
    "group": 1
}
```
### GET /task/
```json
[
    {
        "id": 1,
        "title": "Task #1",
        "description": "opis",
        "group": 1
    },
    {
        "id": 2,
        "title": "Task #2",
        "description": "opis",
        "group": 2
    },
    {
        "id": 3,
        "title": "Task #3",
        "description": "opis",
        "group": 1
    },
    {
        "id": 4,
        "title": "Task #4",
        "description": "opis",
        "group": 3
    }
]
```
### GET /task/{id}/
```json
{
    "id": 1,
    "title": "Task #1",
    "description": "opis",
    "group": 1
}
```
### PUT /task/{id}/
```json
{
    "title": "Nowy tytuł",
    "description": "Nowy opis",
    "group": 1
}
```
### DELETE /task/{id}/
