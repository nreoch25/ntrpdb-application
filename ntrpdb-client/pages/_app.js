import { withApollo } from "../lib/apollo/withApollo";
import { UserProvider } from "../context/UserContext";
import { NotificationProvider } from "../context/NotificationContext";
import "../styles/antd.less";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <NotificationProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </NotificationProvider>
  );
}

export default withApollo({ ssr: true })(MyApp);
