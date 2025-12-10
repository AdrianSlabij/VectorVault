export default async function readTodos() {
  const res = await fetch(`http://127.0.0.1:8000/api/todos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`failed to read todos`);
  
  return res.json();
}
