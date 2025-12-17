
import getAllFiles from "@/api/getAllFiles";
import FileForm from "@/components/FileForm";
import { getAuthTokenOrRedirect } from "@/utils/getToken";

export default async function FilesPage() {

  const token = await getAuthTokenOrRedirect();
  const data = await getAllFiles(token)

  return (
    <div>
      <FileForm token={token} />
    </div>
  );
}