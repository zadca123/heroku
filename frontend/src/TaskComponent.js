import React from 'react';
import styled from 'styled-components';
import Modal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';

const Task = styled.div`
	background: #FFFFFF;
	border-radius: 4px;
	padding: 8px;
	margin: 8px;
	font-size: 14px;
	cursor: pointer;
	border: 2px solid #FFFFFF;
	
	&:hover{
		border: 2px solid #000000;
		background: #EFEFEF;
	}

	.title{
		font-weight: 700;
	}

	.description{}
`;

export default function TaskComponent(props){

	const t = props.t;

	const [showEditTaskModal, setShowEditTaskModal] = useState(false);

	function openEditTaskModal(){
		setShowEditTaskModal(true);
	}

	function closeEditTaskModal(){
		setShowEditTaskModal(false);
	}

	function saveEditedTask(e){
		e.preventDefault();
		closeEditTaskModal();
		props.saveEditedTask(e, t);
	}

	function saveDeletedTask(){
		props.saveDeletedTask(t);
	}

	return(
		<Draggable draggableId={t.id + ''} index={t.position} key={t.id}>
			{provider => (
				<Task {...provider.draggableProps} ref={provider.innerRef} {...provider.dragHandleProps}>
					<div className='title' onClick={openEditTaskModal}>{t.title}</div>
					<div className='description'>{t.description}</div>
					<Modal show={showEditTaskModal} onHide={closeEditTaskModal}>
						<Modal.Header closeButton><Modal.Title>Edycja zadania</Modal.Title></Modal.Header>
						<Modal.Body>
							<Form onSubmit={saveEditedTask} id='form'>
								<Form.Group className='mb-3'>
									<Form.Label>Tytuł zadania</Form.Label>
									<Form.Control type='text' defaultValue={t.title} required/>
								</Form.Group>
								<Form.Group className='mb-3'>
									<Form.Label>Opis zadania</Form.Label>
									<Form.Control type='text' defaultValue={t.description} required/>
								</Form.Group>
							</Form>
						</Modal.Body>
						<Modal.Footer>
							<Button variant='secondary' onClick={closeEditTaskModal}>Zamknij</Button>
							<Button variant='danger' onClick={saveDeletedTask}>Usuń</Button>
							<Button variant='primary' type='submit' form='form'>Zapisz</Button>
						</Modal.Footer>
					</Modal>
				</Task>
			)}
		</Draggable>
	);
}
