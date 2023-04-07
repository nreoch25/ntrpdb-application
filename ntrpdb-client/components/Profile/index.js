import { useContext, useState } from "react";
import { Spin, Card, Typography } from "antd";
import UserContext from "../../context/UserContext";
import { DisplayProfile } from "./DisplayProfile";
import { UpdateProfile } from "./UpdateProfile";

const { Title } = Typography;

const Profile = () => {
  const { user } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);

  if (!user) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (editMode) {
    return (
      <Card className="profile-card">
        <div className="profile-card__intro">
          <Title level={3} className="profile-card__intro-title">
            Update your NTRPDB profile
          </Title>
          <UpdateProfile setEditMode={setEditMode} user={user} />
        </div>
      </Card>
    );
  }

  return (
    <Card className="profile-card">
      <DisplayProfile user={user} setEditMode={setEditMode} />
    </Card>
  );
};

export { Profile };
