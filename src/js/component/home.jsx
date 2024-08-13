import React, { useState } from "react";

const Home = () => {
	const [inputValue, setInputValue] = useState("");
	const [todos, setTodos] = useState([
		{ text: "Make the bed", completed: false },
		{ text: "Take a Shower", completed: false },
	]);

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && inputValue.trim() !== "") {
			addTodo();
		}
	};

	const addTodo = () => {
		if (inputValue.trim() !== "") {
			setTodos([...todos, { text: inputValue, completed: false }]);
			setInputValue("");
		}
	};

	const handleCheckboxChange = (index) => {
		const newTodos = todos.map((todo, i) => 
			i === index ? { ...todo, completed: !todo.completed } : todo
		);
		setTodos(newTodos);
	};

	const handleDelete = (index) => {
		const newTodos = todos.filter((_, i) => i !== index);
		setTodos(newTodos);
	};

	return (
		<div className="container">
			<h1>My Todos</h1>
			<div className="input-container">
				<button onClick={addTodo}>Agregar Todo</button>
				<input 
					type="text"
					onChange={(e) => setInputValue(e.target.value)}
					value={inputValue}
					onKeyPress={handleKeyPress}
					placeholder="What do you need to do?"
				/>
			</div>
			<ul>
				{todos.map((todo, index) => (
					<li key={index}>
						<input 
							type="checkbox"
							checked={todo.completed}
							onChange={() => handleCheckboxChange(index)}
						/>
						<span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
							{todo.text}
						</span>
						<i 
							className="fa-solid fa-trash"
							onClick={() => handleDelete(index)}
							style={{ cursor: 'pointer' }}
						></i>
					</li>
				))}
			</ul>
			<div>{todos.length} Tasks</div>
		</div>
	);
};

export default Home;
