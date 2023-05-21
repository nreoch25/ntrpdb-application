import { useContext, useState } from "react";
import { Spin, Card, Typography } from "antd";
import UserContext from "../../context/UserContext";
import { DisplayProfile } from "./DisplayProfile";
import { UpdateProfile } from "./UpdateProfile";
import { useClubsQuery } from "../../hooks/useClubsQuery";

const { Title } = Typography;

const Profile = () => {
  const { user } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const { data } = useClubsQuery({ limit: 0, page: 0 });
  const clubs = data?.clubs?.result || [];

  const userClubs =
    user && clubs
      ? user.clubs.map((id) => {
          return Object.values(clubs).find((value) => {
            return value.id === id;
          });
        })
      : [];

  console.log({ userClubs });

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
      <DisplayProfile user={user} setEditMode={setEditMode} userClubs={userClubs} />
    </Card>
  );
};

export { Profile };
