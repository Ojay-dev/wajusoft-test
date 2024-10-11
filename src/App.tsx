// Create a todo application with the following properties (that saves to local storage and reads from local storage to display the data)
// Name (Unique and required)
// Description (Optional)
// Completed (Boolean)
// User should be able to fill in the form and also see created todos on the application
// User should be able to search todos (Debounce filtering process)
// User should be able to delete from the todo list

import { useEffect, useState } from 'react';
import './App.css';

interface TodoItem {
	name: string;
	descr?: string;
	completed: boolean;
}

function App() {
	const [formData, setFormData] = useState<TodoItem>({
		name: '',
		descr: '',
		completed: false,
	});
	const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [debouncedTerm, setDebouncedTerm] = useState<string>(searchTerm);

	// Load todos from localStorage when the app first loads
	useEffect(() => {
		const storedItems = localStorage.getItem('myTodoList');
		if (storedItems) {
			try {
				const parsedItems = JSON.parse(storedItems);
				if (Array.isArray(parsedItems)) {
					setTodoItems(parsedItems);
				}
			} catch (error) {
				console.error('Failed to load todos:', error);
			}
		}
	}, []);

	useEffect(() => {
		if (todoItems.length > 0) {
			localStorage.setItem('myTodoList', JSON.stringify(todoItems));
		}
	}, [todoItems]);

	// Debounce the search term
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedTerm(searchTerm);
		}, 300);

		return () => {
			clearTimeout(handler);
		};
	}, [searchTerm]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!formData.name) {
			alert('Name is required');
			return;
		}

		const nameExists = todoItems.some(
			(item) => item.name.toLowerCase() === formData.name.toLowerCase()
		);

		if (nameExists) {
			alert('A todo with this name already exists!');
			return;
		}

		const newTodo: TodoItem = { ...formData, completed: false };
		setTodoItems((prevItems) => [...prevItems, newTodo]);

		setFormData({ name: '', descr: '', completed: false });
	};

	const handleDelete = (name: string) => {
		setTodoItems((prevItems) => prevItems.filter((item) => item.name !== name));
	};

	// Filter the todos based on the debounced search term
	const filteredTodos = todoItems.filter((item) =>
		item.name.toLowerCase().includes(debouncedTerm.toLowerCase())
	);

	return (
		<div className="container">
			<form className="todo-form" onSubmit={handleSubmit}>
				<div>
					<label className="todo-form__label" htmlFor="name">
						Name
					</label>
					<br />
					<input
						type="text"
						className="todo-form__input"
						name="name"
						onChange={handleChange}
						value={formData.name}
						required
					/>
				</div>
				<br />
				<div>
					<label className="todo-form__label" htmlFor="descr">
						Description
					</label>
					<br />
					<textarea
						className="todo-form__textarea"
						name="descr"
						id="description"
						onChange={handleChange}
						value={formData.descr}
					></textarea>
				</div>
				<br />
				<button className="todo-form__button" type="submit">
					Add Todo
				</button>
			</form>

			<div>
				<div className="search">
					<input
						type="search"
						className="search__input"
						placeholder="Search todos..."
						onChange={(e) => setSearchTerm(e.target.value)}
						value={searchTerm}
					/>
				</div>

				<div className="todo-items">
					<h1>Todo List</h1>
					<ol className="todo-items__list">
						{filteredTodos.map((item) => (
							<li className="todo-items__item" key={item.name}>
								<h2 className="todo-items__title">{item.name}</h2>
								<p className="todo-items__descr">{item.descr}</p>
								<button
									className="todo-items__delete-button"
									type="button"
									onClick={() => handleDelete(item.name)}
								>
									Delete
								</button>
							</li>
						))}
					</ol>
				</div>
			</div>
		</div>
	);
}

export default App;
