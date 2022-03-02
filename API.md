# Dokumentacja API
### GET /api/task/
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
### GET /api/task2/
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
### GET /api/group/
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
## TODO
### **GET** /api/group/<group_id>/
### **GET** /api/task/<task_id>/
### **PUT** /api/create/group/ **lub** /api/group/
### **PUT** /api/create/task/ **lub** /api/task/
### **DELETE** /api/delete/group/<groupk_id>/ **lub** /api/group/<group_id>/
### **DELETE** /api/delete/task/<task_id>/ **lub** /api/task/<task_id>/
### **UPDATE** /api/update/group/<group_id>/ **lub** /api/group/<group_id>/
### **UPDATE** /api/update/group/<group_id>/ **lub** /api/group/<group_id>/
