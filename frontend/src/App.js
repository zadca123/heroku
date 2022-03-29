import React from 'react';
import styled from 'styled-components';
import Modal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import config from './config.json';

//import { io } from 'socket.io-client';

//const socket = io(config.SOCKET_SERVER_URL);

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

	.addButton{
		border: 1px solid black;
		width: 200px;
		border-radius: 5px;
		padding: 5px;
		background: #4FBDBA;
		display: inline-block;
		margin: 6px;
		cursor: pointer;

		&:hover{
			background: #76DBD1;
		}

		&.disabled{
			background: #BDC3C7;
		}
	}
`;

const ColumnContainer = styled.div`
	display: flex;
	flex-direction: row;
	padding-left: 224px;
	background: #393E46;
	min-width: fit-content;
`;

const Column = styled.div`
	background: ${props => props.isDragging ? '#F06F32' : '#fd9e02'};
	text-align: center;
	cursor: pointer;
	height: 62px;
	padding: 10px;
	border-radius: 4px;
	min-width: 224px;
	padding: 6px;
	margin: 6px;
	box-sizing: content-box;
	line-height: 62px;

	&:hover{
		background: #F06F32;
	}

	.name{
		color: #000000;
		font-weight: 700;
	}

	.limit{
		color: #FFFFFF;
		font-weight: 700;
	}
`;

const CellRowContainer = styled.div`
	display: flex;
	flex-direction: row;

	.name{
		text-align: center;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #fd9e02;
		margin: 6px;
		border-radius: 4px;
		font-weight: 700;
		min-height: 92px;
		padding: 3px;
	}
`;

const RowContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const Row = styled.div`
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 200px;
	padding: 6px;
	margin: 6px;
	height: 300px;
	font-weight: 700;
	border-radius: 4px;
	background: ${props => props.isDragging ? '#F06F32' : '#fd9e02'};
	box-sizing: content-box;

	&:hover{
		background: #F06F32;
	}
`;

const TaskContainer = styled.div`
	background: #EBECF0;
	border-radius: 4px;
	width: 230px;
	margin: 6px;
	padding: 3px;
	display: flex;
	flex-direction: column;
	height: 306px;
	box-sizing: content-box;

	.limit{
		font-size: 12px;
		width: 200px;
		text-align: center;
		margin-top: auto;
		margin-bottom: 3px;
		margin-left: 3px;
		cursor: pointer;
	}

	&.overLimit{
		background: #FF6E6E;
	}
`;

const TaskList = styled.div`
	overflow-y: scroll;
	overflow-x: hidden;
	height: 400px;
	display: flex;
	flex-direction: column;
	background: ${props => props.isDraggingOver ? '' : ''};
`;

const Task = styled.div`
	.container{
		background: ${props => props.isDragging ? '#FAFBA4' : '#FFFFFF'};
		border-radius: 4px;
		font-size: 14px;
		width: 200px;
		padding: 6px;
		margin: 3px;
		box-sizing: content-box;
		
		&:hover{
			background: #FAFBA4;
		}
	}

	.title{
		font-weight: 700;
	}

	.description{}
`;

const CellContainer = styled.div``;

export default function App(){

	/*
	socket.on('c', (arg) => {
		console.log('c');
	});
	*/

	useEffect(() => {
		loadColumnList();
		loadRowList();
		loadTaskList();
		loadLimitList();
	}, []);

	const [columns, setColumns] = useState([]);
	const [rows, setRows] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [limits, setLimits] = useState([]);

	/*#####################################################################
	#                           DODAWANIE KOLUMNY                         #
	#####################################################################*/

	const [showAddColumnModal, setShowAddColumnModal] = useState(false);
	const openAddColumnModal = () => setShowAddColumnModal(true);
	const closeAddColumnModal = () => setShowAddColumnModal(false);

	function AddColumnModal(){

		/*
		const [taskLimitError, setTaskLimitError] = useState(false);

		function onTaskLimitChange(e){
			if(e.target.value < 0){
				setTaskLimitError(true);
				return;
			}
			setTaskLimitError(false);
		}
		*/

		function addColumn(e){
			e.preventDefault();
			axios.post(config.API_URL + 'column/', {
				name: e.target[0].value,
				position: columns.length
			}).then(response => {
				NotificationManager.success('Kolumna została dodana', 'Powiadomienie');
				closeAddColumnModal();
				loadColumnList();
				rows.map(r => (
					axios.post(config.API_URL + 'limit/', {
						limit: 0,
						column: response.data.id,
						row: r.id
					})
				));
			})
			.catch(error => {
				NotificationManager.error('Błąd podczas dodawania kolumny', 'Błąd');
			});
		}

		return(
			<Modal show={showAddColumnModal} onHide={closeAddColumnModal}>
				<Modal.Header closeButton>
					<Modal.Title>Tworzenie kolumny</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={addColumn} id='form'>
						<Form.Group className='mb-3'>
							<Form.Label>Nazwa kolumny</Form.Label>
							<Form.Control type='text' placeholder='Wpisz nazwe kolumny' required/>
						</Form.Group>
						{/*
						<Form.Group className='mb-3'>
							<Form.Label>Maksymalna liczba zadań</Form.Label>
							<Form.Control type='number' placeholder='Wpisz liczbe zadań' min='0' onChange={onTaskLimitChange} required/>
							{taskLimitError ? <FormError>Podaj liczbę nieujemną</FormError> : null}
						</Form.Group>
						*/}
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={closeAddColumnModal}>Zamknij</Button>
					<Button variant='primary' type='submit' form='form'>Zapisz</Button>
				</Modal.Footer>
			</Modal>
		)
	}

	/*#####################################################################
	#                           DODAWANIE WIERSZA                         #
	#####################################################################*/

	const [showAddRowModal, setShowAddRowModal] = useState(false);
	const openAddRowModal = () => setShowAddRowModal(true);
	const closeAddRowModal = () => setShowAddRowModal(false);

	function AddRowModal(){

		function addRow(e){
			e.preventDefault();
			axios.post(config.API_URL + 'row/', {
				name: e.target[0].value,
				position: rows.length
			}).then(response => {
				NotificationManager.success('Wiersz został dodany', 'Powiadomienie');
				closeAddRowModal();
				loadRowList();
				columns.map(c => (
					axios.post(config.API_URL + 'limit/', {
						limit: 0,
						column: c.id,
						row: response.data.id
					})
				));
				loadLimitList();
			})
			.catch(error => {
				NotificationManager.error('Błąd podczas dodawania wiersza', 'Błąd');
			});
		}

		return(
			<Modal show={showAddRowModal} onHide={closeAddRowModal}>
				<Modal.Header closeButton>
					<Modal.Title>Tworzenie wiersza</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={addRow} id='form'>
						<Form.Group className='mb-3'>
							<Form.Label>Nazwa wiersza</Form.Label>
							<Form.Control type='text' placeholder='Wpisz nazwe wiersza' required/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={closeAddRowModal}>Zamknij</Button>
					<Button variant='primary' type='submit' form='form'>Zapisz</Button>
				</Modal.Footer>
			</Modal>
		)
	}
	
	/*#####################################################################
	#                           DODAWANIE ZADANIA                         #
	#####################################################################*/

	const [showAddTaskModal, setShowAddTaskModal] = useState(false);
	const openAddTaskModal = () => setShowAddTaskModal(true);
	const closeAddTaskModal = () => setShowAddTaskModal(false);

	function AddTaskModal(){

		const [name, setName] = useState();
		const [description, setDescription] = useState('');
		const [column, setColumn] = useState(0);
		const [row, setRow] = useState(0);

		function addTask(){
			if(!name || name.length < 1){
				NotificationManager.error('Niepoprawna nazwa zadania', 'Błąd');
				return;
			}
			if(!description || description.length < 1){
				NotificationManager.error('Niepoprawny opis zadania', 'Błąd');
				return;
			}
			if(column === 0){
				NotificationManager.error('Wybierz kolumnę', 'Informacja');
				return;
			}
			if(row === 0){
				NotificationManager.error('Wybierz wiersz', 'Informacja');
				return;
			}
			axios.post(config.API_URL + 'task/', {
				name: name,
				description: description,
				position: tasks.filter(t => t.column === column && t.row === row).length,
				column: column,
				row: row
			}).then(response => {
				NotificationManager.success('Zadanie zostało dodane', 'Powiadomienie');
				closeAddTaskModal();
				loadTaskList();
			})
			.catch(error => {
				NotificationManager.error('Błąd podczas dodawania zadania', 'Błąd');
			});
		}

		return(
			<Modal show={showAddTaskModal} onHide={closeAddTaskModal}>
				<Modal.Header closeButton>
					<Modal.Title>Tworzenie zadania</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={addTask} id='form'>
						<Form.Group className='mb-3'>
							<Form.Label>Nazwa zadania</Form.Label>
							<Form.Control type='text' placeholder='Wpisz nazwe zadania' required onChange={(e) => setName(e.target.value)}/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Opis zadania</Form.Label>
							<Form.Control type='text' placeholder='Wpisz opis zadania' onChange={(e) => setDescription(e.target.value)} required/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Kolumna</Form.Label>
							<Form.Select onChange={(e) => setColumn(parseInt(e.target.value))}>
								<option value={0} key={0}>Wybierz kolumnę</option>
								{columns.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
							</Form.Select>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Wiersz</Form.Label>
							<Form.Select onChange={(e) => setRow(parseInt(e.target.value))}>
								<option value={0} key={0}>Wybierz wiersz</option>
								{rows.map(r => <option value={r.id} key={r.id}>{r.name}</option>)}
							</Form.Select>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={closeAddTaskModal}>Zamknij</Button>
					<Button variant='primary' onClick={addTask}>Zapisz</Button>
				</Modal.Footer>
			</Modal>
		)
	}

	/*#####################################################################
	#                           ŁADOWANIE DANYCH                          #
	#####################################################################*/

	function loadColumnList(){
		axios.get(config.API_URL + 'column').then(response => {
			setColumns(response.data);
		});
	}

	function loadRowList(){
		axios.get(config.API_URL + 'row').then(response => {
			setRows(response.data);
		});
	}

	function loadTaskList(){
		axios.get(config.API_URL + 'task').then(response => {
			setTasks(response.data);
		});
	}

	function loadLimitList(){
		axios.get(config.API_URL + 'limit').then(response => {
			setLimits(response.data);
		});
	}

	/*#####################################################################
	#                           EDYTOWANIE LIMITU                         #
	#####################################################################*/

	const [showEditLimitModal, setShowEditLimitModal] = useState(false);
	const openEditLimitModal = () => setShowEditLimitModal(true);
	const closeEditLimitModal = () => setShowEditLimitModal(false);

	const [editLimitModal, setEditLimitModal] = useState();

	function EditLimitModal(){

		const [limit, setLimit] = useState(0);

		function editLimit(){
			if(limit < 0){
				NotificationManager.error('Liczba zadań musi być liczbą nieujemną', 'Błąd');
				return;
			}
			axios.patch(config.API_URL + 'limit/' + limits.filter(l => l.column === editLimitModal.column && l.row === editLimitModal.row)[0].id + '/', {
				limit: limit
			}).then(response => {
				NotificationManager.success('Zmiany liczby zadań zostały zapisane', 'Powiadomienie');
				closeEditLimitModal();
				loadLimitList();
			})
			.catch(error => {
				NotificationManager.error('Błąd podczas zapisu liczby zadań', 'Błąd');
			});
		}

		return(
			<Modal show={showEditLimitModal} onHide={closeEditLimitModal}>
				<Modal.Header closeButton>
					<Modal.Title>Zmiana limitu dla kolumny {!editLimitModal ? '' : columns.filter(c => c.id === editLimitModal.column)[0].name} i wiersza {!editLimitModal ? '' : rows.filter(r => r.id === editLimitModal.row)[0].name}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3'>
							<Form.Label>Liczba zadań</Form.Label>
							<Form.Control type='number' defaultValue={!editLimitModal ? '' : limits.filter(l => l.column === editLimitModal.column && l.row === editLimitModal.row)[0].limit} required onChange={(e) => setLimit(e.target.value)}/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={closeEditLimitModal}>Zamknij</Button>
					<Button variant='primary' onClick={editLimit}>Zapisz</Button>
				</Modal.Footer>
			</Modal>
		)
	}

	/*#####################################################################
	#                          EDYTOWANIE KOLUMNY                         #
	#####################################################################*/

	const [showEditColumnModal, setShowEditColumnModal] = useState(false);
	const openEditColumnModal = () => setShowEditColumnModal(true);
	const closeEditColumnModal = () => setShowEditColumnModal(false);

	const [editColumnModal, setEditColumnModal] = useState();

	function EditColumnModal(){

		const [name, setName] = useState();

		function editColumn(){
			if(name < 1){
				NotificationManager.error('Niepoprawna nazwa kolumny', 'Błąd');
				return;
			}
			axios.patch(config.API_URL + 'column/' + editColumnModal + '/', {
				name: name
			}).then(response => {
				NotificationManager.success('Nowa nazwa kolumny została zapisana', 'Powiadomienie');
				closeEditColumnModal();
				loadColumnList();
			})
			.catch(error => {
				NotificationManager.error('Błąd podczas zapisu nazwy kolumny', 'Błąd');
			});
		}

		function deleteColumn(){
			axios.delete(config.API_URL + 'column/' + editColumnModal + '/', {
				name: name
			}).then(response => {
				NotificationManager.success('Kolumna została usunięta', 'Powiadomienie');
				closeEditColumnModal();
				const newColumnList = [];
				for(let i = 0; i < columns.length; i++){
					if(columns[i].id === editColumnModal) continue;
					newColumnList.push(columns[i]);
				}
				setEditColumnModal();
				for(let i = 0; i < newColumnList.length; i++){
					newColumnList[i].position = i;
				}
				setColumns(newColumnList);
				newColumnList.map(c => (
					axios.patch(config.API_URL + 'column/' + c.id + '/', {
						position: c.position
					})
				));
				//loadColumnList();
				loadLimitList();
				loadTaskList();
			})
			.catch(error => {
				NotificationManager.error('Błąd podczas usuwania kolumny', 'Błąd');
			});
		}

		return(
			<Modal show={showEditColumnModal} onHide={closeEditColumnModal}>
				<Modal.Header closeButton>
					<Modal.Title>Edytowanie kolumny {!editColumnModal ? '' : columns.filter(c => c.id === editColumnModal)[0].name}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3'>
							<Form.Label>Nazwa kolumny</Form.Label>
							<Form.Control type='text' placeholder='Wpisz nazwe kolumny' onChange={(e) => setName(e.target.value)}/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={closeEditColumnModal}>Zamknij</Button>
					<Button variant='danger' onClick={deleteColumn}>Usuń</Button>
					<Button variant='primary' onClick={editColumn}>Zapisz</Button>
				</Modal.Footer>
			</Modal>
		)
	}

	/*#####################################################################
	#                          EDYTOWANIE WIERSZA                         #
	#####################################################################*/

	const [showEditRowModal, setShowEditRowModal] = useState(false);
	const openEditRowModal = () => setShowEditRowModal(true);
	const closeEditRowModal = () => setShowEditRowModal(false);

	const [editRowModal, setEditRowModal] = useState();

	function EditRowModal(){

		const [name, setName] = useState();

		function editRow(){
			if(name < 1){
				NotificationManager.error('Niepoprawna nazwa wiersza', 'Błąd');
				return;
			}
			axios.patch(config.API_URL + 'row/' + editRowModal + '/', {
				name: name
			}).then(response => {
				NotificationManager.success('Nowa nazwa wiersza została zapisana', 'Powiadomienie');
				closeEditRowModal();
				loadRowList();
			})
			.catch(error => {
				NotificationManager.error('Błąd podczas zapisu nazwy wiersza', 'Błąd');
			});
		}

		function deleteRow(){
			axios.delete(config.API_URL + 'row/' + editRowModal + '/', {
				name: name
			}).then(response => {
				setEditRowModal();
				NotificationManager.success('Wiersz został usunięty', 'Powiadomienie');
				closeEditRowModal();
				const newList = [];
				for(let i = 0; i < rows.length; i++){
					if(rows[i].id === editRowModal) continue;
					newList.push(rows[i]);
				}
				setEditRowModal();
				for(let i = 0; i < newList.length; i++){
					newList[i].position = i;
				}
				setRows(newList);
				newList.map(r => (
					axios.patch(config.API_URL + 'row/' + r.id + '/', {
						position: r.position
					})
				));
				//loadColumnList();
				loadLimitList();
				loadTaskList();
			})
			.catch(error => {
				NotificationManager.error('Błąd podczas usuwania wiersza', 'Błąd');
			});
		}

		return(
			<Modal show={showEditRowModal} onHide={closeEditRowModal}>
				<Modal.Header closeButton>
					<Modal.Title>Edytowanie wiersza {!editRowModal ? '' : rows.filter(r => r.id === editRowModal)[0].name}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3'>
							<Form.Label>Nazwa wiersza</Form.Label>
							<Form.Control type='text' placeholder='Wpisz nazwe wiersza' onChange={(e) => setName(e.target.value)}/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={closeEditRowModal}>Zamknij</Button>
					<Button variant='danger' onClick={deleteRow}>Usuń</Button>
					<Button variant='primary' onClick={editRow}>Zapisz</Button>
				</Modal.Footer>
			</Modal>
		)
	}

	/*#####################################################################
	#                          EDYTOWANIE ZADANIA                         #
	#####################################################################*/

	const [showEditTaskModal, setShowEditTaskModal] = useState(false);
	const openEditTaskModal = () => setShowEditTaskModal(true);
	const closeEditTaskModal = () => setShowEditTaskModal(false);

	const [editTaskModal, setEditTaskModal] = useState();

	function EditTaskModal(){

		const [name, setName] = useState(tasks.filter(t => t.id === editTaskModal).length === 0 ? null : tasks.filter(t => t.id === editTaskModal)[0].name);
		const [description, setDescription] = useState(tasks.filter(t => t.id === editTaskModal).length === 0 ? null : tasks.filter(t => t.id === editTaskModal)[0].description);

		function editTask(){
			if(!name || name.length < 1){
				NotificationManager.error('Niepoprawna nazwa zadania', 'Błąd');
				return;
			}
			axios.patch(config.API_URL + 'task/' + editTaskModal + '/', {
				name: name,
				description: description
			}).then(response => {
				NotificationManager.success('Zmiany w zadaniu zapisane', 'Powiadomienie');
				closeEditTaskModal();
				loadTaskList();
			})
			.catch(error => {
				NotificationManager.error('Błąd podczas zapisu zadania', 'Błąd');
			});
		}

		function deleteTask(){
			axios.delete(config.API_URL + 'task/' + editTaskModal + '/').then(response => {
				NotificationManager.success('Zadanie zostało usunięte', 'Powiadomienie');
				closeEditTaskModal();

				const deletedTask = tasks.filter(t => t.id === editTaskModal)[0];
				setEditRowModal();
				const column = deletedTask.column;
				const row = deletedTask.row;

				const newList = [];

				let newPosition = 0;
				for(let i = 0; i < tasks.length; i++){
					if(tasks[i].column === column && tasks[i].row === row){
						if(tasks[i].id === deletedTask.id) continue;
						tasks[i].position = newPosition;
						newPosition++;
					}
					newList.push(tasks[i]);
				}

				newList.filter(t => t.column === column && t.row === row).map(t => (
					axios.patch(config.API_URL + 'task/' + t.id + '/', {
						position: t.position
					})
				));

				setTasks(newList);
			})
			.catch(error => {
				NotificationManager.error('Błąd podczas usuwania zadania', 'Błąd');
			});
		}

		return(
			<Modal show={showEditTaskModal} onHide={closeEditTaskModal}>
				<Modal.Header closeButton>
					<Modal.Title>Edytowanie zadania {!editTaskModal || tasks.filter(t => t.id === editTaskModal).length === 0 ? '' : tasks.filter(t => t.id === editTaskModal)[0].name}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={editTask}>
						<Form.Group className='mb-3'>
							<Form.Label>Nazwa zadania</Form.Label>
							<Form.Control type='text' defaultValue={!editTaskModal || tasks.filter(t => t.id === editTaskModal).length === 0 ? '' : tasks.filter(t => t.id === editTaskModal)[0].name} onChange={(e) => setName(e.target.value)}/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Opis zadania</Form.Label>
							<Form.Control type='text' defaultValue={!editTaskModal || tasks.filter(t => t.id === editTaskModal).length === 0 ? '' : tasks.filter(t => t.id === editTaskModal)[0].description} onChange={(e) => setDescription(e.target.value)}/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={closeEditTaskModal}>Zamknij</Button>
					<Button variant='danger' onClick={deleteTask}>Usuń</Button>
					<Button variant='primary' onClick={editTask}>Zapisz</Button>
				</Modal.Footer>
			</Modal>
		)
	}

	/*#####################################################################
	#                                                                     #
	#####################################################################*/

	function onDragEnd(e){
		const { type, source, destination } = e;
		if(!destination) return;
		if(source.droppableId === destination.droppableId && source.index === destination.index) return;
		if(type === 'column'){
			const dragElement = columns.splice(source.index, 1);
			columns.splice(destination.index, 0, dragElement[0]);
			for(let i = 0; i < columns.length; i++){
				columns[i].position = i;
			}
			setColumns(columns);
			columns.map(c => (
				axios.patch(config.API_URL + 'column/' + c.id + '/', {
					position: c.position
				})
			));
			loadTaskList();
			return;
		}
		if(type === 'row'){
			const newRows = rows.slice();
			if(source.index < destination.index){
				newRows.filter(r => r.position > source.index && r.position <= destination.index).map(r => (
					r.position = r.position - 1
				));
			}
			else if(source.index > destination.index){
				newRows.filter(r => r.position >= destination.index && r.position < source.index).map(r => (
					r.position = r.position + 1
				))
			}
			newRows[source.index].position = destination.index;
			newRows.sort((a, b) => {
				if(a.position < b.position) return -1;
				if(a.position > b.position) return 1;
				return 0;
			});
			setRows(newRows);
			newRows.map(r => (
				axios.patch(config.API_URL + 'row/' + r.id + '/', {
					position: r.position
				})
			));
			return;
		}
		if(type === 'task'){
			const id = parseInt(e.draggableId.split('-')[1]);
			const sourceRow = parseInt(source.droppableId.split('-')[1]);
			const sourceColumn = parseInt(source.droppableId.split('-')[3]);
			const sourcePosition = source.index;
			const destinationRow = parseInt(destination.droppableId.split('-')[1]);
			const destinationColumn = parseInt(destination.droppableId.split('-')[3]);
			const destinationPosition = destination.index;
			
			const newList = tasks.slice();
			if(sourceColumn === destinationColumn && sourceRow === destinationRow){
				const newList2 = tasks.filter(t => t.column === sourceColumn && t.row === sourceRow);
				// przesuwanie w dół
				if(source.index < destination.index){
					newList2.filter(t => t.position > source.index && t.position <= destination.index).forEach(t => {
						//console.log(`${t.name}: ${t.position} -> ${t.position - 1}`);
						t.position = t.position - 1;
						axios.patch(config.API_URL + 'task/' + t.id + '/', {
							position: t.position
						});
					});
				}
				// przesuwanie w górę
				else if(source.index > destination.index){
					newList2.filter(t => t.position >= destination.index && t.position < source.index).forEach(t => {
						//console.log(`${t.name}: ${t.position} -> ${t.position + 1}`);
						t.position = t.position + 1;
						axios.patch(config.API_URL + 'task/' + t.id + '/', {
							position: t.position
						});
					});
				}
				const dragElement = newList2.filter(t => t.id === id)[0];
				//console.log(`${dragElement.name}: ${dragElement.position} -> ${destination.index}`);
				dragElement.position = destination.index;
				axios.patch(config.API_URL + 'task/' + dragElement.id + '/', {
					position: dragElement.position
				});
				newList.sort((a, b) => {
					if(a.position < b.position) return -1;
					if(a.position > b.position) return 1;
					return 0;
				});
				setTasks(newList);
				return;
			}
			// kontener dolecowy
			const destinationList = newList.filter(t => t.column === destinationColumn && t.row === destinationRow && t.position >= destinationPosition);
			destinationList.forEach(t => {
				//console.log(`${t.name}: ${t.position} -> ${t.position + 1}`);
				t.position = t.position + 1;
				axios.patch(config.API_URL + 'task/' + t.id + '/', {
					position: t.position
				});
			});
			//console.log(destinationList);
			// wybrany element
			const dragElement = newList.filter(t => t.id === id)[0];
			//console.log(`${dragElement.name}: ${dragElement.position} -> ${destination.index}`);
			dragElement.position = destination.index;
			dragElement.column = destinationColumn;
			dragElement.row = destinationRow;
			axios.patch(config.API_URL + 'task/' + dragElement.id + '/', {
				position: dragElement.position,
				column: dragElement.column,
				row: dragElement.row
			});
			// kontener źródłowy
			const sourceList = newList.filter(t => t.column === sourceColumn && t.row === sourceRow && t.position > sourcePosition);
			sourceList.forEach(t => {
				//console.log(`${t.name}: ${t.position} -> ${t.position - 1}`);
				t.position = t.position - 1;
				axios.patch(config.API_URL + 'task/' + t.id + '/', {
					position: t.position
				});
			});
			//console.log(sourceList);
			// sortowanie i aktualizacja
			newList.sort((a, b) => {
				if(a.position < b.position) return -1;
				if(a.position > b.position) return 1;
				return 0;
			});
			setTasks(newList);
		}
	}

	function noAdd(){
		NotificationManager.error('Brak kolumn lub wierszy', 'Błąd');
	}

	return(
		<Container>
			<Header>
				<div className='title'>Projekt Kanban</div>
				{/*<div className='subtitle'>dla Billennium</div>*/}
				<div className='addButton' onClick={openAddColumnModal}>Dodaj kolumnę</div>
				<div className='addButton' onClick={openAddRowModal}>Dodaj wiersz</div>
				<div className={columns.length > 0 && rows.length > 0 ? 'addButton' : 'addButton disabled'} onClick={columns.length > 0 && rows.length > 0 ? openAddTaskModal : noAdd}>Dodaj zadanie</div>
				<AddColumnModal/>
				<AddRowModal/>
				<AddTaskModal/>
			</Header>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId='column-container' direction='horizontal' type='column'>
					{provider => (
						<ColumnContainer {...provider.droppableProps} ref={provider.innerRef}>
							{columns.map(c => (
								<Draggable draggableId={'column-' + c.id} index={c.position} key={c.id}>
									{(provider, snapshot) => (
										<Column
											{...provider.draggableProps}
											ref={provider.innerRef}
											{...provider.dragHandleProps}
											onClick={() => {setEditColumnModal(c.id);openEditColumnModal();}}
											isDragging={snapshot.isDragging}
										>
											<div className='name'>{c.name}</div>
											{/*<div className='limit'>{c.limit === 0 ? '∞' : c.limit}</div>*/}
										</Column>
									)}
								</Draggable>
							))}
							{provider.placeholder}
						</ColumnContainer>
					)}
				</Droppable>
				<div style={{display: 'flex', flexDirection: 'row'}}>
					<Droppable droppableId='row-container' direction='vertical' type='row'>
						{provider => (
							<RowContainer {...provider.droppableProps} ref={provider.innerRef}>
								{rows.map(r => (
									<Draggable draggableId={'row-' + r.id} index={r.position} key={r.id}>
										{(provider, snapshot) => (
											<Row
												{...provider.draggableProps}
												ref={provider.innerRef}
												{...provider.dragHandleProps}
												onClick={() => {setEditRowModal(r.id);openEditRowModal();}}
												isDragging={snapshot.isDragging}
											>
												{r.name}
											</Row>
										)}
									</Draggable>
								))}
								{provider.placeholder}
							</RowContainer>
						)}
					</Droppable>
					<CellContainer>
						{rows.map(r => (
							<CellRowContainer key={r.id}>
								{columns.map(c => (
									<TaskContainer key={c.id} className={limits.filter(l => l.column === c.id && l.row === r.id).length > 0 && limits.filter(l => l.column === c.id && l.row === r.id)[0].limit > 0 && tasks.filter(t => t.column === c.id && t.row === r.id).length > limits.filter(l => l.column === c.id && l.row === r.id)[0].limit ? 'limit overLimit' : 'limit'}>
										<Droppable droppableId={'row-' + r.id + '-column-' + c.id} direction='vertical' type='task' key={c.id}>
											{(provider, snapshot) => (
												<TaskList
													{...provider.droppableProps}
													ref={provider.innerRef}
													isDraggingOver={snapshot.isDraggingOver}
												>
													{tasks.filter(t => t.column === c.id && t.row === r.id).map(t => (
														<Draggable draggableId={'task-' + t.id} index={t.position} key={t.id}>
															{(provider, snapshot) => (
																<Task
																	{...provider.draggableProps}
																	ref={provider.innerRef}
																	{...provider.dragHandleProps}
																	isDragging={snapshot.isDragging}
																>
																	<div className='container' onClick={() => {setEditTaskModal(t.id);openEditTaskModal();}}>
																		<div className='title'>{t.name}</div>
																		<div className='description'>{t.description}</div>
																	</div>
																</Task>
															)}
														</Draggable>
													))}
												{provider.placeholder}
												</TaskList>
											)}
										</Droppable>
										<div className='limit' onClick={() => {
											setEditLimitModal({column: c.id, row: r.id});
											openEditLimitModal();
										}}>
											Limit zadań: {limits.filter(l => l.column === c.id && l.row === r.id).length > 0 && limits.filter(l => l.column === c.id && l.row === r.id)[0].limit > 0 ? limits.filter(l => l.column === c.id && l.row === r.id)[0].limit : '∞'}
										</div>
									</TaskContainer>
								))}
							</CellRowContainer>
						))}
					</CellContainer>
				</div>
			</DragDropContext>
			<EditLimitModal/>
			<EditColumnModal/>
			<EditRowModal/>
			<EditTaskModal/>
			<NotificationContainer/>
		</Container>
	);
}
