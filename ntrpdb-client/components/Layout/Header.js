import { Fragment, useContext } from "react";
import { Layout, Menu, Avatar } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useLogoutMutation } from "../../hooks/useLogoutMutation";
import UserContext from "../../context/UserContext";

const { Header } = Layout;
const { Item, SubMenu } = Menu;

const AppHeader = () => {
  const { user, setUser } = useContext(UserContext);
  console.log({ user });
  const { handleLogout } = useLogoutMutation({ setUser });

  return (
    <Header>
      <Link href="/">
        <div className="header-logo">
          <Image
            src="/images/tennis-ball.png"
            alt="tennis logo"
            height="40px"
            width="40px"
            className="header-logo__image"
          />
          <span className="header-logo__text">NTRPDB</span>
        </div>
      </Link>
      <Menu theme="dark" mode="horizontal" className="justify-right">
        {/* <Item key="1">
          <Link href="/players">Players</Link>
        </Item> */}
        <Item key="2">
          <Link href="/clubs">Clubs</Link>
        </Item>

        {!user && (
          <Fragment>
            <Item key="3">
              <Link href="/login">Sign In</Link>
            </Item>
          </Fragment>
        )}

        {user && (
          <SubMenu key="SubMenu" title={<Avatar src={user.avatar} />}>
            <Item key="4">
              <Link href="/profile">
                <a>
                  <UserOutlined style={{ marginRight: "5px" }} />
                  Profile
                </a>
              </Link>
            </Item>

            <Item key="5">
              <div onClick={handleLogout}>
                <LogoutOutlined style={{ marginRight: "5px" }} />
                Sign out
              </div>
            </Item>
          </SubMenu>
        )}
      </Menu>
    </Header>
  );
};

export default AppHeader;
