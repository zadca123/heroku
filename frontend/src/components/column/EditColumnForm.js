import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import config from '../../config.json';

export default function EditColumnForm(props){

    const [name, setName] = useState(props.column.name);
    const [limit, setLimit] = useState(props.column.limit);

    const [columnList, setColumnList] = useState([]);

    useEffect(() => {
        axios.get(process.env.API_URL + 'column').then(response => {
			setColumnList(response.data);
		});
    }, []);

    function save(){
        if(!name || name.length < 1){
            NotificationManager.error('Niepoprawna nazwa', 'Błąd');
            return;
        }
        if(columnList.filter(c => c.name === name).length > 0 && name !== props.column.name){
            NotificationManager.error('Kolumna istnieje', 'Błąd');
            return;
        }
        if(!Number.isInteger(limit) || limit < 0){
            NotificationManager.error('Niepoprawny limit', 'Błąd');
            return;
        }
        axios.patch(process.env.API_URL + 'column/' + props.column.id + '/', {
            name: name,
            limit: limit
        }).then(response => {
            NotificationManager.success('Zmiany zapisane', 'Powiadomienie');
            props.onClose();
            props.onSave();
        })
        .catch(error => {
            NotificationManager.error('Zmiany niezapisane', 'Błąd');
        });
    }

    function deleteColumn(){
        axios.delete(process.env.API_URL + 'column/' + props.column.id + '/').then(response => {
            NotificationManager.success('Kolumna usunięta', 'Powiadomienie');
            props.onClose();
            const newColumnList = [];
            for(let i = 0; i < columnList.length; i++){
                if(columnList[i].id === props.column.id) continue;
                newColumnList.push(columnList[i]);
            }
            for(let i = 0; i < newColumnList.length; i++){
                newColumnList[i].position = i;
            }
            newColumnList.map(c => (
                axios.patch(process.env.API_URL + 'column/' + c.id + '/', {
                    position: c.position
                })
            ));
            props.onSave();
        })
        .catch(error => {
            NotificationManager.error('Kolumna nieusunięta', 'Błąd');
        });
    }

    return(
        <>
            <Modal.Header closeButton>
                <Modal.Title>
                    Edytowanie kolumny <b>{props.column.name}</b>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>Nazwa kolumny</Form.Label>
                        <Form.Control type='text' placeholder='Wpisz nazwe' onChange={(e) => setName(e.target.value)} defaultValue={props.column.name}/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Limit zadań na kolumnę</Form.Label>
                        <Form.Control type='number' placeholder='Wpisz limit' min='0' onChange={(e) => setLimit(parseInt(e.target.value))} defaultValue={props.column.limit}/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.onClose}>Zamknij</Button>
                <Button variant='danger' onClick={deleteColumn}>Usuń</Button>
                <Button variant='primary' onClick={save}>Zapisz</Button>
            </Modal.Footer>
        </>
    )
}