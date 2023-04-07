import { useRouter } from "next/router";
import AppLayout from "../../components/Layout";

const UserPage = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  return (
    <AppLayout>
      <h1>User Page: {id}</h1>
    </AppLayout>
  );
};

export default UserPage;
