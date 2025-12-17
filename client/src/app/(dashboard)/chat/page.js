import { getAuthTokenOrRedirect } from "@/utils/getToken";
import Chat from "@/components/Chat";

export default async function Dashboard() {
  // One line to get token and handle security!
  const token = await getAuthTokenOrRedirect();

  return (
    <div>
      <Chat token={token} />
    </div>
  );
}