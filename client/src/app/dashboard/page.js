"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import createTodos from "@/api/createTodos";
import readTodos from "@/api/readTodos";
import deleteTodos from "@/api/deleteTodos"

import FileForm from "@/components/FileForm";

export default function Dashboard() {
  const supabase = createClient();
  const router = useRouter();
  const [newTask, setNewTask] = useState("");
  const [desc, setDesc] = useState("");
  const [todoList, setTodoList] = useState([])
  const [id, setID] = useState()

  const handleLogout = async () => {
    let { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
    router.push("/sign-in");
  };


  const handleCreate = async () => {
    try{
      await createTodos(newTask,desc)
    }catch(e){
      console.error("Error creating todo:", e);
    }
  };

  const handleRead = async () =>{
    try{
      const data = await readTodos()
      //console.log(data)
      setTodoList(data)
    }catch(e){
      console.error("Error reading todos:", e);
    }
  }
  const handleDelete = async () => {
    const result = await deleteTodos(id)
    console.log(result)

    if(result){
      handleRead()
    }else{
      alert("Failed to delete task")
    }
    
  }



  return (
    <div>
      <h1>Dashboard Page</h1>

      <Button onClick={handleLogout}>Logout</Button>
      <input
        name="AddTask"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add Task"
      ></input>
      <input
        name="AddDesc"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Add Description"
      ></input>
      <input placeholder="Enter ID" onChange={(e) => setID(e.target.value)}></input>
      <Button onClick={handleCreate}>Create</Button>

      <Button onClick={handleRead}>Read</Button>
      <Button>Update</Button>
      <Button onClick={handleDelete}>Delete</Button>

        {todoList?.length > 0 ? (
          todoList.map((todo, index) => (
            <div key={index}>
              <h3>{todo.item}</h3>
              <p>{todo.desc}</p>
            </div>
          ))
        ) : (
          <p>No todos found. Click "Read" to fetch them.</p>
        )}
        
        <FileForm></FileForm>
      </div>

      

  );
}