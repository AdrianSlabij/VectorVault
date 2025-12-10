export default async function deleteTodos(id) {

    try{
  const res = await fetch(`http://127.0.0.1:8000/api/todos/${id}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
  });
  if (!res.ok){
    throw new Error(`Server error: ${res.status}`)
  }
  return await res.json()

}catch(e){
    console.error(`Failed to delete todo:`, e)
    return null

}
}