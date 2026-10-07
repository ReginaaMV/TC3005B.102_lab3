import { useEffect, useState } from "react";
import "./App.css";
import supabase from "./supabase-client";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    consulta();
  }, []);

  // READ
  const consulta = async () => {
    const { data, error } = await supabase.from("pendientes").select("*");
    if (error) {
      console.log("Error de conexion en consulta: ", error);
    } else {
      setTodoList(data);
    }
  };

  // CREATE
  const addTodo = async () => {
    if (!newTodo.trim()) return;

    const { data, error } = await supabase
      .from("pendientes")
      .insert([{ name: newTodo.trim(), isCompleted: false }])
      .select();

    if (error) {
      console.log("Error en el insert: ", error);
    } else {
      setTodoList((prev) => [...prev, data[0]]);
      setNewTodo("");
    }
  };

  // UPDATE
  const completeTask = async (id, isCompleted) => {
    const { error } = await supabase
      .from("pendientes")
      .update({ isCompleted: !isCompleted })
      .eq("id", id);

    if (error) {
      console.log("Error en el update: ", error);
    } else {
      setTodoList((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
        )
      );
    }
  };

  // DELETE
  const deleteTask = async (id) => {
    const { error } = await supabase.from("pendientes").delete().eq("id", id);

    if (error) {
      console.log("Error en el delete: ", error);
    } else {
      setTodoList((prev) => prev.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          placeholder="New Todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo Item</button>
      </div>
      <ul>
        {todoList.map((todo) => (
          <li key={todo.id}>
            <p style={{ textDecoration: todo.isCompleted ? "line-through" : "none" }}>
              {todo.name}
            </p>
            <button onClick={() => completeTask(todo.id, todo.isCompleted)}>
              {todo.isCompleted ? "Undo" : "Complete Task"}
            </button>
            <button onClick={() => deleteTask(todo.id)}>Delete Task</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;