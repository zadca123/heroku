import React from 'react';
import styled from 'styled-components';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import config from './config.json';
import AddColumnForm from './components/column/AddColumnForm';
import EditColumnForm from './components/column/EditColumnForm';
import AddRowForm from './components/row/AddRowForm';
import EditRowForm from './components/row/EditRowForm';
import EditCellForm from './components/cell/EditCellForm';
import AddTaskForm from './components/task/AddTaskForm';
import EditTaskForm from './components/task/EditTaskForm';

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
	padding: 10px;
	border-radius: 4px;
	min-width: 224px;
	padding: 6px;
	margin: 6px;
	box-sizing: content-box;
	display: flex;
	flex-direction: column;

	&:hover{
		background: #F06F32;
	}

	.name{
		font-weight: 700;
	}

	.limit{
	}

	&.overLimit{
		background: #FF6E6E;
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
	border-radius: 4px;
	background: ${props => props.isDragging ? '#F06F32' : '#fd9e02'};
	box-sizing: content-box;

	&:hover{
		background: #F06F32;
	}

	.name{
		font-weight: 700;
	}

	&.overLimit{
		background: #FF6E6E;
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

	.users{
		text-align: center;
	}

	.user{
		width: 22px;
		height: 22px;
		border-radius: 11px;
		text-align: center;
		line-height: 22px;
		color: #FFFFFF;
		margin: 2px;
		display: inline-block;
		padding: 2px;
		box-sizing: content-box;
		background: #4D96FF;
	}
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
		loadUserList();
		loadTaskUserList();
	}, []);

	const [columns, setColumns] = useState([]);
	const [rows, setRows] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [limits, setLimits] = useState([]);
	const [users, setUsers] = useState([]);
	const [taskUser, setTaskUser] = useState([]);

	const [selectedColumn, setSelectedColumn] = useState();
	const [selectedRow, setSelectedRow] = useState();
	const [selectedTask, setSelectedTask] = useState();

	/*#####################################################################
	#                           DODAWANIE KOLUMNY                         #
	#####################################################################*/

	const [showAddColumnModal, setShowAddColumnModal] = useState(false);
	const openAddColumnModal = () => setShowAddColumnModal(true);
	const closeAddColumnModal = () => setShowAddColumnModal(false);

	function AddColumnModal(){

		return(
			<Modal show={showAddColumnModal} onHide={closeAddColumnModal}>
				<AddColumnForm onClose={closeAddColumnModal} onSave={loadColumnList}/>
			</Modal>
		)
	}

	/*#####################################################################
	#                          EDYTOWANIE KOLUMNY                         #
	#####################################################################*/

	const [showEditColumnModal, setShowEditColumnModal] = useState(false);
	const openEditColumnModal = () => setShowEditColumnModal(true);
	const closeEditColumnModal = () => setShowEditColumnModal(false);

	function EditColumnModal(){

		return(
			<Modal show={showEditColumnModal} onHide={closeEditColumnModal}>
				<EditColumnForm column={selectedColumn} onClose={closeEditColumnModal} onSave={loadColumnList}/>
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

		return(
			<Modal show={showAddRowModal} onHide={closeAddRowModal}>
				<AddRowForm onClose={closeAddRowModal} onSave={loadRowList}/>
			</Modal>
		)
	}

	/*#####################################################################
	#                          EDYTOWANIE WIERSZA                         #
	#####################################################################*/

	const [showEditRowModal, setShowEditRowModal] = useState(false);
	const openEditRowModal = () => setShowEditRowModal(true);
	const closeEditRowModal = () => setShowEditRowModal(false);

	function EditRowModal(){

		return(
			<Modal show={showEditRowModal} onHide={closeEditRowModal}>
				<EditRowForm row={selectedRow} onClose={closeEditRowModal} onSave={loadRowList}/>
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

		return(
			<Modal show={showAddTaskModal} onHide={closeAddTaskModal}>
				<AddTaskForm onClose={closeAddTaskModal} onSave={loadTaskList}/>
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

	function loadUserList(){
		axios.get(config.API_URL + 'user').then(response => {
			setUsers(response.data);
		});
	}

	function loadTaskUserList(){
		axios.get(config.API_URL + 'taskUser').then(response => {
			setTaskUser(response.data);
		});
	}

	/*#####################################################################
	#                           EDYTOWANIE LIMITU                         #
	#####################################################################*/

	const [showEditLimitModal, setShowEditLimitModal] = useState(false);
	const openEditLimitModal = () => setShowEditLimitModal(true);
	const closeEditLimitModal = () => setShowEditLimitModal(false);

	function EditLimitModal(){

		return(
			<Modal show={showEditLimitModal} onHide={closeEditLimitModal}>
				<EditCellForm column={selectedColumn} row={selectedRow} onClose={closeEditLimitModal} onSave={loadLimitList}/>
			</Modal>
		)
	}

	/*#####################################################################
	#                          EDYTOWANIE ZADANIA                         #
	#####################################################################*/

	const [showEditTaskModal, setShowEditTaskModal] = useState(false);
	const openEditTaskModal = () => setShowEditTaskModal(true);
	const closeEditTaskModal = () => setShowEditTaskModal(false);

	function EditTaskModal(){

		return(
			<Modal show={showEditTaskModal} onHide={() => {closeEditTaskModal(); loadTaskUserList()}}>
				<EditTaskForm task={selectedTask} onClose={() => {closeEditTaskModal(); loadTaskUserList()}} onSave={loadTaskList}/>
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
											onClick={() => {setSelectedColumn(c);openEditColumnModal();}}
											isDragging={snapshot.isDragging}
											className={c.limit > 0 && tasks.filter(t => t.column === c.id).length > c.limit ? 'overLimit' : ''}
										>
											<div className='name'>{c.name}</div>
											<div className='limit'>{c.limit === 0 ? '∞' : c.limit}</div>
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
												onClick={() => {setSelectedRow(r);openEditRowModal();}}
												isDragging={snapshot.isDragging}
												className={r.limit > 0 && tasks.filter(t => t.row === r.id).length > r.limit ? 'overLimit' : ''}
											>
												<div className='name'>{r.name}</div>
												<div className='limit'>{r.limit === 0 ? '∞' : r.limit}</div>
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
																	<div className='container' onClick={() => {setSelectedTask(t);openEditTaskModal();}}>
																		<div className='title'>{t.name}</div>
																		<div className='description'>{t.description}</div>
																		<div className='users'>
																			{taskUser.filter(tu => tu.task === t.id).map(tu =>
																				users.filter(u => u.id === tu.user).map(u =>
																					<div className='user' key={u.id}>
																						{u.name.split('')[0] + u.name.split('')[1]}
																					</div>
																				)
																			)}
																		</div>
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
											setSelectedColumn(c);
											setSelectedRow(r);
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
