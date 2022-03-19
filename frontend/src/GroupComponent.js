import React from 'react';
import styled from 'styled-components';
import TaskComponent from './TaskComponent';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

	.header{
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

		.title{
			color: #000000;
			font-weight: 700;
		}

		.subtitle{
			color: #FFFFFF;
			font-weight: 700;
		}
	}

	.taskList{
		margin: 0 4px;
		overflow-y: auto;
		min-height: 80px;
	}

	.createTask{
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
	}
`;

export default function GroupComponent(props){

	const g = props.g;

	/*#####################################################################
	#                   EDYTOWANIE GRUPY GRUPY - MODAL                    #
	#####################################################################*/

	const [showEditGroupModal, setShowEditGroupModal] = useState(false);

	function openEditGroupModal(){
		setShowEditGroupModal(true);
	}

	function closeEditGroupModal(){
		setShowEditGroupModal(false);
	}

	function saveEditedGroup(e){
		e.preventDefault();
		closeEditGroupModal();
		props.saveEditedGroup(e, g);
	}

	function saveDeletedGroup(){
		props.saveDeletedGroup(g);
	}

	function saveEditedTask(e, t){
		props.saveEditedTask(e, t);
	}

	function saveDeletedTask(t){
		props.saveDeletedTask(t);
	}

	const [showAddTaskModal, setShowAddTaskModal] = useState(false);

	function openAddTaskModal(){
		setShowAddTaskModal(true);
	}

	function closeAddTaskModal(){
		setShowAddTaskModal(false);
	}

	function saveAddedTask(e){
		e.preventDefault();
		closeAddTaskModal();
		props.saveAddedTask(e, g);
	}

	return(
		<Draggable draggableId={g.id + ''} index={g.position} key={g.id}>
			{provider => (
				<Group {...provider.draggableProps} ref={provider.innerRef} className={g.limit > 0 && g.task_set.length > g.limit ? 'overLimit' : ''}>
					<div className='header' {...provider.dragHandleProps} onClick={openEditGroupModal}>
						<div className='title'>{g.name}</div>
						<div className='subtitle'>{g.limit === 0 ? '∞' : g.limit}</div>
					</div>
					<Droppable droppableId={g.position + ''} type='task'>
						{provider => (
							<div className='taskList' {...provider.droppableProps} ref={provider.innerRef}>
								{g.task_set.map((t) => (
									<TaskComponent t={t} key={t.id} saveEditedTask={saveEditedTask} saveDeletedTask={saveDeletedTask}/>
								))}
								{provider.placeholder}
							</div>
						)}
					</Droppable>
					<div className='createTask' onClick={openAddTaskModal}>+ Nowe zadanie</div>
					<Modal show={showEditGroupModal} onHide={closeEditGroupModal}>
						<Modal.Header closeButton>
							<Modal.Title>Edycja grupy</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form onSubmit={saveEditedGroup} id='form'>
								<Form.Group className='mb-3'>
									<Form.Label>Nazwa grupy</Form.Label>
									<Form.Control type='text' defaultValue={g.name}/>
								</Form.Group>
								<Form.Group className='mb-3'>
									<Form.Label>Maksymalna liczba zadań</Form.Label>
									<Form.Control type='number' defaultValue={g.limit}/>
								</Form.Group>
							</Form>
						</Modal.Body>
						<Modal.Footer>
							<Button variant='secondary' onClick={closeEditGroupModal}>Zamknij</Button>
							<Button variant='danger' onClick={saveDeletedGroup}>Usuń</Button>
							<Button variant='primary' type='submit' form='form'>Zapisz</Button>
						</Modal.Footer>
					</Modal>
					<Modal show={showAddTaskModal} onHide={closeAddTaskModal}>
						<Modal.Header closeButton><Modal.Title>Tworzenie nowego zadania</Modal.Title></Modal.Header>
						<Modal.Body>
							<Form onSubmit={saveAddedTask} id='form'>
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
							<Button variant='secondary' onClick={closeAddTaskModal}>Zamknij</Button>
							<Button variant='primary' type='submit' form='form'>Zapisz</Button>
						</Modal.Footer>
					</Modal>
				</Group>
			)}
		</Draggable>
	);
}
