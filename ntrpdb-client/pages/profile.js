import AppLayout from "../components/Layout";
import { Layout } from "antd";
import { Profile } from "../components/Profile";

const { Content } = Layout;

const ProfilePage = () => {
  return (
    <AppLayout>
      <Content className="profile">
        <Profile />
      </Content>
    </AppLayout>
  );
};

export default ProfilePage;
