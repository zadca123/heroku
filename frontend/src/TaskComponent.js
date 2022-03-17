import React from 'react';
import styled from 'styled-components';

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
`;

const Title = styled.div`
	font-weight: 700;
`;

const Description = styled.div``;

export default function TaskComponent(props){

	const openEditTaskModal = () => props.openEditTaskModal(props.t);

	return(
		<Task onClick={openEditTaskModal}>
			<Title>{props.t.title}</Title>
			<Description>{props.t.description}</Description>
        </Task>
	);
}
