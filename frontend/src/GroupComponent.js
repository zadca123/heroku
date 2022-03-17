import React from 'react';
import styled from 'styled-components';
import TaskComponent from './TaskComponent';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Group = styled.div`
	background: #EBECF0;
	min-width: 270px;
	max-width: 270px;
	margin: 0 4px;
	border-radius: 3px;
	display: flex;
	flex-direction: column;
	height: 100%;
	flex: 1;
	min-height: 200px;

	&.overLimit{
		background: #FF6E6E;
	}
`;

const Header = styled.div`
	margin: 5px;
	background: lightgreen;
	text-align: center;
	min-height: 72px;
	padding: 10px;
	cursor: pointer;
	border: 2px solid lightgreen;

	&:hover{
		border: 2px solid black;
	}
`;

const Title = styled.div`
	color: #000000;
	font-weight: 700;
`;

const Subtitle = styled.div`
	color: #FFFFFF;
	font-weight: 700;
`;

const TaskList = styled.div`
	margin: 0 4px;
	overflow-y: auto;
`;

const CreateTask = styled.div`
	background: #FFFFFF;
	border-radius: 4px;
	padding: 8px;
	margin: 8px;
	font-size: 14px;
	cursor: pointer;
	border: 2px solid #FFFFFF;

	&:hover{
		border: 2px solid black;
	}
`;

export default function GroupComponent(props){

	const onEditGroup = (e) => {
		e.preventDefault();
		props.onEditGroup(props.g.id, e.target[0].value, e.target[1].value, closeEditGroupModal);
	}

	const onDeleteGroup = (e) => {
		props.onDeleteGroup(props.g.id, closeEditGroupModal);
	}

	const [showEditGroupModal, setShowEditGroupModal] = useState(false);
	const openEditGroupModal = () => setShowEditGroupModal(true);
	const closeEditGroupModal = () => setShowEditGroupModal(false);

	const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
	const openCreateTaskModal = () => setShowCreateTaskModal(true);
	const closeCreateTaskModal = () => setShowCreateTaskModal(false);

	const onCreateTask = (e) => {
		e.preventDefault();
		props.onCreateTask(e, props.g);
		closeCreateTaskModal();
	}

	const [showEditTaskModal, setShowEditTaskModal] = useState(false);
	const openEditTaskModal = (t) => {
		setShowEditTaskModal(true);
		setEditTaskData(t);
	}
	const closeEditTaskModal = () => setShowEditTaskModal(false);

	const [editTaskData, setEditTaskData] = useState({});

	const onEditTask = (e) => {
		e.preventDefault();
		props.onEditTask(editTaskData, e);
		closeEditTaskModal();
	}

	const onDeleteTask = () => {
		props.onDeleteTask(editTaskData.id);
		closeEditTaskModal();
	}

	return(
		<Group className={props.g.limit > 0 && props.g.task_set.length > props.g.limit ? 'overLimit' : ''}>
            <Header onClick={openEditGroupModal}>
                <Title>{props.g.name}</Title>
                <Subtitle>{props.g.limit === 0 ? '∞' : props.g.limit}</Subtitle>
            </Header>
            <TaskList>{props.g.task_set.map((t) => <TaskComponent key={t.id} t={t} openEditTaskModal={openEditTaskModal}/>)}</TaskList>
            <CreateTask onClick={openCreateTaskModal}>+ Nowe zadanie</CreateTask>
			<Modal show={showEditGroupModal} onHide={closeEditGroupModal}>
				<Modal.Header closeButton>
					<Modal.Title>Edycja grupy</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={onEditGroup} id='form'>
						<Form.Group className='mb-3'>
							<Form.Label>Nazwa grupy</Form.Label>
							<Form.Control type='text' defaultValue={props.g.name}/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Maksymalna liczba zadań</Form.Label>
							<Form.Control type='number' defaultValue={props.g.limit}/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={closeEditGroupModal}>Zamknij</Button>
					<Button variant='danger' onClick={onDeleteGroup}>Usuń</Button>
					<Button variant='primary' type='submit' form='form'>Zapisz</Button>
				</Modal.Footer>
			</Modal>
			<Modal show={showCreateTaskModal} onHide={closeCreateTaskModal}>
				<Modal.Header closeButton><Modal.Title>Tworzenie nowego zadania</Modal.Title></Modal.Header>
				<Modal.Body>
					<Form onSubmit={onCreateTask} id='form'>
						<Form.Group className='mb-3'>
							<Form.Label>Tytuł zadania</Form.Label>
							<Form.Control type='text' placeholder='Wpisz tytuł zadania'/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Opis zadania</Form.Label>
							<Form.Control type='text' placeholder='Wpisz opis zadania'/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={closeCreateTaskModal}>Zamknij</Button>
					<Button variant='primary' type='submit' form='form'>Zapisz</Button>
				</Modal.Footer>
			</Modal>
			<Modal show={showEditTaskModal} onHide={closeEditTaskModal}>
				<Modal.Header closeButton><Modal.Title>Edycja zadania</Modal.Title></Modal.Header>
				<Modal.Body>
					<Form onSubmit={onEditTask} id='form'>
						<Form.Group className='mb-3'>
							<Form.Label>Tytuł zadania</Form.Label>
							<Form.Control type='text' defaultValue={editTaskData.title}/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Opis zadania</Form.Label>
							<Form.Control type='text' defaultValue={editTaskData.description}/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={closeEditTaskModal}>Zamknij</Button>
					<Button variant='danger' onClick={onDeleteTask}>Usuń</Button>
					<Button variant='primary' type='submit' form='form'>Zapisz</Button>
				</Modal.Footer>
			</Modal>
        </Group>
	);
}
