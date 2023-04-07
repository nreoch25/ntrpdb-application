import { Layout } from "antd";
import AppHeader from "./Header";

const AppLayout = ({ children }) => {
  return (
    <Layout id="app">
      <AppHeader />
      {children}
    </Layout>
  );
};

export default AppLayout;
