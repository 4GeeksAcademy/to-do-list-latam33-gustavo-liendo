import React, { useEffect, useState } from "react";

const Home = () => {
	const [inputValue, setInputValue] = useState("");
	const [todos, setTodos] = useState([]);
	const [userName, setUserName] = useState("");
	const [userExists, setUserExists] = useState(false);
	const [existingUsers, setExistingUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState("");

	const fetchExistingUsers = async () => {
		try {
			const response = await fetch('https://playground.4geeks.com/todo/users');
			if (response.ok) {
				const data = await response.json();
				setExistingUsers(data.users);
			} else {
				alert("Failed to fetch existing users.");
			}
		} catch (error) {
			alert("Error fetching users.");
		}
	};

	const checkUserExists = async () => {
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`);
			if (response.ok) {
				const data = await response.json();
				setTodos(data.todos || []);
				setUserExists(true);
			} else if (response.status === 404) {
				createUser();
			} else {
				alert("Error checking user. Please try again.");
			}
		} catch (error) {
			alert("Error checking user.");
		}
	};

	const createUser = async () => {
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
				method: 'POST',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify([]) 
			});
			if (response.status === 201) {
				alert("User created successfully.");
				setUserExists(true);
				setTodos([]);
				fetchExistingUsers();
			} else if (response.status === 400) {
				alert("User already exists.");
				checkUserExists();
			} else {
				alert("Failed to create user.");
			}
		} catch (error) {
			alert("Error creating user.");
		}
	};

	const deleteUser = async (userNameToDelete) => {
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/users/${userNameToDelete}`, {
				method: 'DELETE',
			});
			if (response.ok) {
				alert(`User ${userNameToDelete} deleted successfully.`);
				setExistingUsers(existingUsers.filter(user => user.name !== userNameToDelete));
				if (userNameToDelete === userName) {
					setUserName("");
					setUserExists(false);
					setTodos([]);
				}
			} else {
				alert("Failed to delete user.");
			}
		} catch (error) {
			alert("Error deleting user.");
		}
	};

	const createTask = async () => {
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/todos/${userName}`, {
				method: 'POST',
				body: JSON.stringify({
					label: inputValue,
					is_done: false,
				}),
				headers: {
				  "Content-Type": "application/json"
				}
			});
			if (response.ok) {
				const newTodo = await response.json();
				setTodos([...todos, newTodo]);
				setInputValue("");
			} else {
				alert("Failed to add task.");
			}
		} catch (error) {
			alert("Error creating task.");
		}
	};

	const updateTodo = async (todoId, updatedTodo) => {
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
				method: 'PUT',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(updatedTodo)
			});

			if (response.ok) {
				setTodos(todos.map(todo => (todo.id === todoId ? updatedTodo : todo)));
			} else {
				alert("Failed to update todo.");
			}
		} catch (error) {
			alert("Error updating todo.");
		}
	};

	const deleteTask = async (todoId) => {
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				const updatedTodos = todos.filter(todo => todo.id !== todoId);
				setTodos(updatedTodos);
			} else {
				alert("Failed to delete task.");
			}
		} catch (error) {
			alert("Error deleting task.");
		}
	};

	const handleCheckboxChange = (index) => {
		const todo = todos[index];
		const updatedTodo = { ...todo, is_done: !todo.is_done };
		updateTodo(todo.id, updatedTodo);
	};

	const handleDelete = (index) => {
		const todoToDelete = todos[index].id;
		deleteTask(todoToDelete);
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && inputValue.trim() !== "" && userExists) {
			createTask();
		}
	};

	const handleUserSelection = (e) => {
		setSelectedUser(e.target.value);
		setUserName(e.target.value);
	};

	useEffect(() => {
		fetchExistingUsers();
	}, []);

	useEffect(() => {
		if (userName) {
			checkUserExists();
		}
	}, [userName]);

	return (
		<div className="container">
			<h1>My Todos</h1>
			<div className="input-container">
				<label>Select or Create User:</label>
				<div id="userSelects-container">
					<select value={selectedUser} onChange={handleUserSelection}>
						<option value="">Select a user</option>
						{existingUsers.map(user => (
							<option key={user.id} value={user.name}>{user.name}</option>
						))}
					</select>
					<button onClick={() => deleteUser(selectedUser)}>Delete User</button>
				</div>
				<input 
					type="text"
					onChange={(e) => setUserName(e.target.value)}
					value={userName}
					placeholder="Enter your username"
				/>
				<button onClick={createUser}>Create User</button>
			</div>
			{userExists && (
				<>
					<div className="input-container">
						<button onClick={createTask}>Add Todo</button>
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
							<li key={todo.id}>
								<input 
									type="checkbox"
									checked={todo.is_done}
									onChange={() => handleCheckboxChange(index)}
								/>
								<span style={{ textDecoration: todo.is_done ? 'line-through' : 'none' }}>
									{todo.label}
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
				</>
			)}
		</div>
	);
};

export default Home;
