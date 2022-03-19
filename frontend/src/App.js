import React from 'react';
import './App.css';
import styled from 'styled-components';
import GroupComponent from './GroupComponent';
import Modal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import useApp from './useApp';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Container = styled.div`
	height: 100vh;
`;

const Header = styled.div`
	text-align: center;

	.title{
		font-weight: 700;
		font-size: 40px;
	}

	.subtitle{
		font-weight: 700;
		font-size: 20px;
		margin-bottom: 20px;
	}

	.addGroupButton{
		border: 1px solid black;
		width: 200px;
		margin: auto;
		border-radius: 5px;
		padding: 5px;

		&:hover{
			background: lightgreen;
			cursor: pointer;
		}
	}
`

const DroppableGroupContainer = styled.div`
	display: flex;
	flex-direction: row;
	padding: 5px;
	overflow-x: auto;
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

	useEffect(() => {
		loadData();
	}, []);

	const [data, setData] = useState([]);

	function loadData(){
		axios.get('http://localhost:8000/').then(response => {
			setData(response.data);
		});
	}

	function saveGroupPosition(newData){
		if(newData){
			newData.map(g => {
				axios.patch('http://localhost:8000/group/' + g.id + '/', {
					position: g.position
				});
			});
			return;
		}
		data.map(g => {
			axios.patch('http://localhost:8000/group/' + g.id + '/', {
				position: g.position
			});
		});
	}

	/*#####################################################################
	#                      DODAWANIE GRUPY - MODAL                        #
	#####################################################################*/

	const [showAddGroupModal, setShowAddGroupModal] = useState(false);

	function openAddGroupModal(){
		setShowAddGroupModal(true);
	}

	function closeAddGroupModal(){
		setShowAddGroupModal(false);
	}

	function AddGroupModal(){
		return(
			<Modal show={showAddGroupModal} onHide={closeAddGroupModal}>
				<Modal.Header closeButton>
					<Modal.Title>Dodawanie grupy</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={saveAddedGroup} id='form'>
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
					<Button variant='secondary' onClick={closeAddGroupModal}>Zamknij</Button>
					<Button variant='primary' type='submit' form='form'>Zapisz</Button>
				</Modal.Footer>
			</Modal>
		)
	}

	function saveAddedGroup(e){
		e.preventDefault();
		axios.post('http://localhost:8000/group/', {
			name: e.target[0].value,
			limit: e.target[1].value,
			position: data.length + 1
		}).then(response => {
			console.log('Grupa dodana');
			closeAddGroupModal();
			loadData();
		})
		.catch(error => {
			console.log('Grupa niedodana');
		});
	}

	function saveEditedGroup(e, g){
		axios.patch('http://localhost:8000/group/' + g.id + '/', {
			name: e.target[0].value,
			limit: e.target[1].value,
		}).then(response => {
			loadData();
		});
	}

	function saveDeletedGroup(g){
		axios.delete('http://localhost:8000/group/' + g.id + '/').then(response => {
			const newData = [];
			for(let i = 0; i < data.length; i++){
				if(data[i].id === g.id) continue;
				newData.push(data[i]);
			}
			for(let i = 0; i < newData.length; i++){
				newData[i].position = i + 1;
			}
			setData(newData);
			saveGroupPosition(newData);
        });
	}

	function saveEditedTask(e, t){
		axios.patch('http://localhost:8000/task/' + t.id + '/', {
			title: e.target[0].value,
			description: e.target[1].value,
		}).then(response => {
			loadData();
		});
	}

	function saveTaskPosition(newData){
		newData.map(t => {
			axios.patch('http://localhost:8000/task/' + t.id + '/', {
				group: t.group,
				position: t.position
			});
		});
	}

	function saveDeletedTask(t){
		console.log(t);
		axios.delete('http://localhost:8000/task/' + t.id + '/').then(response => {
			loadData();
        });
	}

	function saveAddedTask(e, g){
		axios.post('http://localhost:8000/task/', {
			title: e.target[0].value,
			description: e.target[1].value,
			group: g.id,
			position: g.task_set.length + 1
		}).then(response => {
			console.log('Zadanie dodane');
			loadData();
		})
		.catch(error => {
			console.log('Zadanie niedodane');
		});
	}

	function onDragEnd(e){
		const { type, source, destination } = e;
		if(type === 'group'){
			if(!destination) return;
			if(source.droppableId === destination.droppableId && source.index === destination.index) return;
			if(source.droppableId !== destination.droppableId) return;
			const temp = data.slice();
			const removed = temp.splice(source.index - 1, 1);
			temp.splice(destination.index - 1, 0, removed[0]);
			for(let i = 0; i < temp.length; i++){
				temp[i].position = i + 1;
			}
			setData(temp);
			saveGroupPosition();
			return;
		}
		if(type === 'task'){
			if(source.droppableId === destination.droppableId && source.index === destination.index) return;
			if(source.droppableId === destination.droppableId){
				const temp = data.slice();
				const task_temp = data[0].task_set.slice();
				const removed = task_temp.splice(source.index - 1, 1);
				task_temp.splice(destination.index - 1, 0, removed[0]);
				for(let i = 0; i < task_temp.length; i++){
					task_temp[i].position = i + 1;
				}
				temp[0].task_set = task_temp;
				setData(temp);
				saveTaskPosition(task_temp);
				return;
			}
			const temp = data.slice();
			const item = temp[source.droppableId - 1].task_set.splice(source.index - 1, 1);
			item[0].group = temp[destination.droppableId - 1].id;
			temp[destination.droppableId - 1].task_set.splice(destination.index - 1, 0, item[0]);
			for(let i = 0; i < temp[source.droppableId - 1].task_set.length; i++){
				temp[source.droppableId - 1].task_set[i].position = i + 1;
			}
			for(let i = 0; i < temp[destination.droppableId - 1].task_set.length; i++){
				temp[destination.droppableId - 1].task_set[i].position = i + 1;
			}
			setData(temp);
			saveTaskPosition(temp[source.droppableId - 1].task_set);
			saveTaskPosition(temp[destination.droppableId - 1].task_set);
		}
	}

	return(
		<Container>
			<Header>
				<div className='title'>Projekt Kanban</div>
				<div className='subtitle'>dla Billennium</div>
				<div className='addGroupButton' onClick={openAddGroupModal}>Dodaj grupę</div>
				<AddGroupModal/>
			</Header>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId='droppableGroups' direction='horizontal' type='group'>
					{provider => (
						<DroppableGroupContainer {...provider.droppableProps} ref={provider.innerRef}>
							{data.map(g => (
								<GroupComponent g={g} key={g.id} saveEditedGroup={saveEditedGroup} saveDeletedGroup={saveDeletedGroup} saveEditedTask={saveEditedTask} saveDeletedTask={saveDeletedTask} saveAddedTask={saveAddedTask}/>
							))}
							{provider.placeholder}
						</DroppableGroupContainer>
					)}
				</Droppable>
			</DragDropContext>
		</Container>
	);
}
