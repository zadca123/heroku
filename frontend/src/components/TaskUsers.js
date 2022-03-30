import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import config from '../config.json';

export default function TaskUser(props){

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

    function isUserChecked(e, data){
        if(e.target.checked){
            axios.post(config.API_URL + 'taskUser/', {
                task: data.task,
                user: data.user
            }).then(response => {
                axios.get(config.API_URL + 'taskUser').then(response => {
                    setTaskUser(response.data);
                });
            });
        }
        else{
            axios.delete(config.API_URL + 'taskUser/' + data.id + '/').then(response => {
                axios.get(config.API_URL + 'taskUser').then(response => {
                    setTaskUser(response.data);
                });
            });
        }
    }

    return(
        <Form.Group className='mb-3'>
            <Form.Label>Przypisani użytkownicy</Form.Label>
            {console.log('users')}
            {console.log(users)}
            {console.log(taskUser)}
            {users.map(u => (
                taskUser.filter(tu => tu.task === props.data.editTaskModal && tu.user === u.id).length === 0 ? <Form.Check type='checkbox' label={u.name} onClick={(e) => isUserChecked(e, {task: props.data.editTaskModal, user: u.id})} key={u.id}/> : <Form.Check type='checkbox' label={u.name} defaultChecked onClick={(e) => isUserChecked(e, {id: taskUser.filter(tu => tu.task === props.data.editTaskModal && tu.user === u.id)[0].id, task: props.data.editTaskModal, user: u.id})} key={u.id}/>
            ))}
        </Form.Group>
    );
}