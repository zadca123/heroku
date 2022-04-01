import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import config from '../../config.json';

export default function EditTaskForm(props){

    const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [column, setColumn] = useState(0);
	const [row, setRow] = useState(0);

    const [taskList , setTaskList] = useState([]);
    const [columnList , setColumnList] = useState([]);
    const [rowList , setRowList] = useState([]);
    const [userList , setUserList] = useState([]);
    const [taskUserList , setTaskUserList] = useState([]);

    useEffect(() => {
        axios.get(config.API_URL + 'task').then(response => {
			setTaskList(response.data);
		});
        axios.get(config.API_URL + 'column').then(response => {
			setColumnList(response.data);
		});
        axios.get(config.API_URL + 'row').then(response => {
			setRowList(response.data);
		});
        axios.get(config.API_URL + 'user').then(response => {
			setUserList(response.data);
		});
        axios.get(config.API_URL + 'taskUser').then(response => {
			setTaskUserList(response.data);
		});
    }, []);

    function save(){
        if(name.length < 1){
            NotificationManager.error('Niepoprawna nazwa', 'Błąd');
            return;
        }
        axios.patch(config.API_URL + 'task/' + props.task.id + '/', {
            name: name,
            description: description,
        }).then(response => {
            NotificationManager.success('Zadanie zapisane', 'Powiadomienie');
            props.onClose();
            props.onSave();
        })
        .catch(error => {
            NotificationManager.error('Zadanie niezapisane', 'Błąd');
        });
    }

    function deleteTask(){
        axios.delete(config.API_URL + 'task/' + props.task.id + '/').then(response => {
            NotificationManager.success('Zadanie usunięte', 'Powiadomienie');
            props.onClose();
            const taskListFiltered = taskList.filter(t => t.column === props.task.column && t.row === props.task.row);
            const newTaskList = [];
            for(let i = 0; i < taskListFiltered.length; i++){
                if(taskListFiltered[i].id === props.task.id) continue;
                newTaskList.push(taskListFiltered[i]);
            }
            for(let i = 0; i < newTaskList.length; i++){
                newTaskList[i].position = i;
            }
            newTaskList.map(t => (
                axios.patch(config.API_URL + 'task/' + t.id + '/', {
                    position: t.position
                })
            ));
            props.onSave();
        })
        .catch(error => {
            NotificationManager.error('Zadanie nieusunięte', 'Błąd');
        });
    }

    function setIsUserChecked(e, userId, taskUserId){
        if(e.target.checked){
            axios.post(config.API_URL + 'taskUser/', {
                task: props.task.id,
                user: userId
            }).then(response => {
                NotificationManager.success('Użytkownik przypięty', 'Powiadomienie');
                axios.get(config.API_URL + 'taskUser').then(response => {
                    setTaskUserList(response.data);
                });
            })
            .catch(error => {
                NotificationManager.error('Użytkownik nieprzypięty', 'Błąd');
            });
        }
        else{
            axios.delete(config.API_URL + 'taskUser/' + taskUserId + '/').then(response => {
                NotificationManager.success('Użytkownik odpięty', 'Powiadomienie');
                axios.get(config.API_URL + 'taskUser').then(response => {
                    setTaskUserList(response.data);
                });
            })
            .catch(error => {
                NotificationManager.error('Użytkownik nieodpięty', 'Błąd');
            });
        }
    }

    return(
        <>
            <Modal.Header closeButton>
                <Modal.Title>
                    Edytowanie zadania <b>{props.task.name}</b>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>Nazwa zadania</Form.Label>
                        <Form.Control type='text' placeholder='Wpisz nazwe' onChange={(e) => setName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Opis zadania</Form.Label>
                        <Form.Control type='text' placeholder='Wpisz opis' onChange={(e) => setDescription(e.target.value)}/>
                    </Form.Group>
                    {/*
                    <Form.Group className='mb-3'>
                        <Form.Label>Przypisani użytkownicy <b>(Zapisywanie automatyczne)</b></Form.Label>
                        {userList.map(u => (
                            taskUserList.filter(tu => tu.task === props.task.id && tu.user === u.id).length === 0 ?
                                <Form.Check type='checkbox' label={u.name} onClick={(e) => setIsUserChecked(e, u.id)} key={u.id}/> :
                                <Form.Check type='checkbox' label={u.name} defaultChecked onClick={(e) => setIsUserChecked(e, u.id, taskUserList.filter(tu => tu.task === props.task.id && tu.user === u.id)[0].id)} key={u.id}/>
                        ))}
                    </Form.Group>
                    */}
                    <Form.Group className='mb-3'>
                        <Form.Label>Przypisani użytkownicy</Form.Label>
                        {taskUserList.filter(tu => tu.task === props.task.id).map(tu => (
                            <div key={tu.id}>{userList.filter(u => u.id === tu.user)[0].name}<br/></div>
                        ))}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.onClose}>Zamknij</Button>
                <Button variant='danger' onClick={deleteTask}>Usuń</Button>
                <Button variant='primary' onClick={save}>Zapisz</Button>
            </Modal.Footer>
        </>
    )
}