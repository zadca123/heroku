import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApp(){
    const update = () => {
		axios.get('http://kanbanapi.jrk.atthost24.pl/').then(response => {
			setJson(response.data);
		});
	}

	useEffect(() => {
		update();
	}, []);
	
	const [json, setJson] = useState([]);

	function onCreateGroup(e){
		e.preventDefault();
		axios.post('http://kanbanapi.jrk.atthost24.pl/group/', {
			name: e.target[0].value,
			limit: e.target[1].value
		}).then(response => {
			console.log('Dodano nową grupę.');
			closeCreateGroupModal();
			update();
		})
		.catch(error => {
			console.log('Nie dodano nowej grupy.');
		});
	}

	const onEditGroup = (id, name, limit, close) => {
		axios.put('http://kanbanapi.jrk.atthost24.pl/group/' + id + '/', {
			name: name,
			limit: limit
		}).then(response => {
			console.log('Zmiany');
			close();
			update();
		})
		.catch(error => {
			console.log('Brak zmian');
		});
	}

	function onDeleteGroup(id, close){
		axios.delete('http://kanbanapi.jrk.atthost24.pl/group/' + id + '/').then(response => {
			console.log('Grupa została usunięta.');
			close();
			update();
        })
        .catch(error => {
			console.log('Błąd podczas usuwania grupy.');
        });
	}

	const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
	const openCreateGroupModal = () => setShowCreateGroupModal(true);
	const closeCreateGroupModal = () => setShowCreateGroupModal(false);

	const onCreateTask = (e, g) => {
		axios.post('http://kanbanapi.jrk.atthost24.pl/task/', {
			title: e.target[0].value,
			description: e.target[1].value,
			group: g.id
		}).then(response => {
			console.log('Dodano nowe zadanie.');
			update();
		})
		.catch(error => {
			console.log('Nie dodano nowego zadania.');
		});
	}

	const onEditTask = (t, e) => {
		axios.put('http://kanbanapi.jrk.atthost24.pl/task/' + t.id + '/', {
			title: e.target[0].value,
			description: e.target[1].value,
			group: t.group,
		}).then(response => {
			console.log('Zmiany zadania');
            //setNotificationMessage('Zmiany w zadania zapisane.');
            //openNotification();
			update();
		})
		.catch(error => {
			console.log('Brak zmian zadania');
		});
	}

	function onDeleteTask(id){
		axios.delete('http://kanbanapi.jrk.atthost24.pl/task/' + id + '/').then(response => {
			console.log('Zadanie usunięte.');
			update();
        })
        .catch(error => {
			console.log('Błąd podczas usuwania zadania.');
        });
	}

    return{
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
    }
}
