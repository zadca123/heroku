import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import config from '../../config.json';

export default function EditCellForm(props){

    const [limit, setLimit] = useState(0);

    const [limitList, setLimitList] = useState([]);

    useEffect(() => {
        axios.get(config.API_URL + 'limit').then(response => {
			setLimitList(response.data);
		});
    }, []);

    function save(){
        if(limit < 0){
            NotificationManager.error('Niepoprawny limit', 'Błąd');
            return;
        }
        const cellList = limitList.filter(l => l.column === props.column.id && l.row === props.row.id);
        if(cellList.length === 0){
            if(limit > 0){
                axios.post(config.API_URL + 'limit/', {
                    column: props.column.id,
                    row: props.row.id,
                    limit: limit
                }).then(response => {
                    NotificationManager.success('Limit dodany', 'Powiadomienie');
                    props.onClose();
                    props.onSave();
                })
                .catch(error => {
                    NotificationManager.error('Limit niedodany', 'Błąd');
                });
                return;
            }
            props.onClose();
            return;
        }
        if(limit === 0){
            axios.delete(config.API_URL + 'limit/' + cellList[0].id + '/').then(response => {
                NotificationManager.success('Limit usunięty', 'Powiadomienie');
                props.onClose();
                props.onSave();
            })
            .catch(error => {
                NotificationManager.error('Limit nieusunięty', 'Błąd');
            });
            return;
        }
        axios.patch(config.API_URL + 'limit/' + cellList[0].id + '/', {
            limit: limit
        }).then(response => {
            NotificationManager.success('Limit zapisany', 'Powiadomienie');
            props.onClose();
            props.onSave();
        })
        .catch(error => {
            NotificationManager.error('Limit niezapisany', 'Błąd');
        });
    }

    return(
        <>
            <Modal.Header closeButton>
                <Modal.Title>
                    Edytowanie limitu dla kolumny <b>{props.column.name}</b> i wiersza <b>{props.row.name}</b>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>Limit zadań na komórkę</Form.Label>
                        <Form.Control type='number' placeholder='Wpisz limit' min='0' onChange={(e) => setLimit(parseInt(e.target.value))}/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.onClose}>Zamknij</Button>
                <Button variant='primary' onClick={save}>Zapisz</Button>
            </Modal.Footer>
        </>
    )
}