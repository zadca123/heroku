# Dokumentacja API
### GET /task/
```json
[
    {
        "id": 1,
        "description": "Task #1",
        "group": 1
    },
    {
        "id": 2,
        "description": "Task #2",
        "group": 2
    },
    {
        "id": 3,
        "description": "Task #3",
        "group": 2
    },
    {
        "id": 4,
        "description": "Task #5",
        "group": 2
    },
    {
        "id": 5,
        "description": "Task #4",
        "group": 3
    }
]
```
### GET /task2/
```json
[
    {
        "id": 1,
        "description": "Task #1",
        "group": {
            "id": 1,
            "name": "Do zrobienia",
            "limit": 0
        }
    },
    {
        "id": 2,
        "description": "Task #2",
        "group": {
            "id": 2,
            "name": "W trakcie",
            "limit": 2
        }
    },
    {
        "id": 3,
        "description": "Task #3",
        "group": {
            "id": 2,
            "name": "W trakcie",
            "limit": 2
        }
    },
    {
        "id": 4,
        "description": "Task #5",
        "group": {
            "id": 2,
            "name": "W trakcie",
            "limit": 2
        }
    },
    {
        "id": 5,
        "description": "Task #4",
        "group": {
            "id": 3,
            "name": "Gotowe",
            "limit": 0
        }
    }
]
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
        "limit": 2
    },
    {
        "id": 3,
        "name": "Gotowe",
        "limit": 0
    }
]
```
### GET /group/2
```json
{
    "id": 2,
    "name": "W trakcie",
    "limit": 2
}
```
### GET /task/3
```json
{
    "id": 3,
    "description": "Task #3",
    "group": 2
}
```
### GET /task2/3
```json
{
   "id": 3,
   "description": "Task #3",
   "group": {
     "id": 2,
     "name": "W trakcie",
     "limit": 2
   }
}
```
## TODO
### permisje
### filtry
### testy
