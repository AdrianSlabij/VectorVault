export default async function createTodos(taskName,description){



const res = await fetch(`http://127.0.0.1:8000/api/todos`,{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({id: Date.now(), item: taskName, desc: description})
});



  if (!res.ok) throw new Error('Failed to fetch from FastAPI');
  
  return res.json()
}