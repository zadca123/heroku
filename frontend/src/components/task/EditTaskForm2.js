import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import config from '../../config.json';

export default function EditTaskForm(props){

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [users, setUsers] = useState([]);
    const [taskUser, setTaskUser] = useState([]);

    useEffect(() => {
        axios.get(config.API_URL + 'user').then(response => {
			setUsers(response.data);
		});
        axios.get(config.API_URL + 'taskUser').then(response => {
			setTaskUser(response.data);
		});
    }, []);

    function setIsUserChecked(e, userId, taskUserId){
        if(e.target.checked){
            axios.post(config.API_URL + 'taskUser/', {
                task: props.task.id,
                user: userId
            }).then(response => {
                axios.get(config.API_URL + 'taskUser').then(response => {
                    setTaskUser(response.data);
                });
            });
        }
        else{
            axios.delete(config.API_URL + 'taskUser/' + taskUserId + '/').then(response => {
                axios.get(config.API_URL + 'taskUser').then(response => {
                    setTaskUser(response.data);
                });
            });
        }
    }

    function save(){
        if(name.length < 1){
            NotificationManager.error('Niepoprawna nazwa zadania', 'Błąd');
            return;
        }
        axios.patch(config.API_URL + 'task/' + props.task.id + '/', {
            name: name,
            description: description
        }).then(response => {
            NotificationManager.success('Zmiany w zadaniu zapisane', 'Powiadomienie');
            props.onClose();
            props.onSave();
        })
        .catch(error => {
            NotificationManager.error('Błąd podczas zapisu zadania', 'Błąd');
        });
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
                        <Form.Control type='text' defaultValue={name} onChange={(e) => setName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Opis zadania</Form.Label>
                        <Form.Control type='text' defaultValue={description} onChange={(e) => setDescription(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Przypisani użytkownicy</Form.Label>
                        {users.map(u => (
                            taskUser.filter(tu => tu.task === props.task.id && tu.user === u.id).length === 0 ?
                                <Form.Check type='checkbox' label={u.name} onClick={(e) => setIsUserChecked(e, u.id)} key={u.id}/> :
                                <Form.Check type='checkbox' label={u.name} defaultChecked onClick={(e) => setIsUserChecked(e, u.id, taskUser.filter(tu => tu.task === props.task.id && tu.user === u.id)[0].id)} key={u.id}/>
                        ))}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.onClose}>Zamknij</Button>
                <Button variant='danger' onClick={props.onDelete}>Usuń</Button>
                <Button variant='primary' onClick={save}>Zapisz</Button>
            </Modal.Footer>
        </>
    )
}