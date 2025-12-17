
import FileForm from "@/components/FileForm";
import { getAuthTokenOrRedirect } from "@/utils/getToken";

export default async function FilesPage() {

  const token = await getAuthTokenOrRedirect();

  return (
    <div>
      <FileForm token={token} />
    </div>
  );
}