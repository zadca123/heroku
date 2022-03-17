import React from 'react';
import './App.css';
import styled from 'styled-components';
import GroupComponent from './GroupComponent';
import Modal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import useApp from './useApp';

const Container = styled.div`
	display: flex;
	flex-direction: row;
	height: 100vh;
	overflow-y: hidden;
	overflow-x: auto;
	padding: 5px;
`;

const CreateGroup = styled.div`
	margin: 5px;
	background: lightgreen;
	text-align: center;
	height: 72px;
	line-height: 48px;
	padding: 10px;
	cursor: pointer;
	font-weight: 700;
	min-width: 150px;
	border: 2px solid lightgreen;

	&:hover{
		border: 2px solid black;
	}
`;

export default function App(){
	
	const {
        json,
        onCreateGroup,
        onEditGroup,
        onDeleteGroup,
        showCreateGroupModal,
        openCreateGroupModal,
        closeCreateGroupModal,
        onCreateTask,
        onEditTask,
        onDeleteTask,
        showNotification,
        closeNotification,
        notification
    } = useApp();

	return(
		<Container>
			{json.map((g) => <GroupComponent key={g.id} g={g} onEditGroup={onEditGroup} onDeleteGroup={onDeleteGroup} onCreateTask={onCreateTask} onEditTask={onEditTask} onDeleteTask={onDeleteTask}/>)}
			<CreateGroup onClick={openCreateGroupModal}>+ Nowa grupa</CreateGroup>
			<Modal show={showCreateGroupModal} onHide={closeCreateGroupModal}>
				<Modal.Header closeButton>
					<Modal.Title>Tworzenie nowej grupy</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={onCreateGroup} id='form'>
						<Form.Group className='mb-3'>
							<Form.Label>Nazwa grupy</Form.Label>
							<Form.Control type='text' placeholder='Wpisz nazwe grupy'/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Maksymalna liczba zadań</Form.Label>
							<Form.Control type='number' placeholder='Wpisz liczbe zadań'/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={closeCreateGroupModal}>Zamknij</Button>
					<Button variant='primary' type='submit' form='form'>Zapisz</Button>
				</Modal.Footer>
			</Modal>
            <Modal show={notification.show} onHide={closeNotification}>
                <Modal.Header closeButton><Modal.Title>{notification.title}</Modal.Title></Modal.Header>
                <Modal.Body>
					{notification.message}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='primary' onClick={closeNotification}>OK</Button>
                </Modal.Footer>
            </Modal>
		</Container>
	);
}
