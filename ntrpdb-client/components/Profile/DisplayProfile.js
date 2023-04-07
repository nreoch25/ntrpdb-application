import Image from "next/image";
import { Button, Typography } from "antd";

const { Title } = Typography;

const DisplayProfile = ({ user, setEditMode }) => {
  return (
    <div>
      <Button style={{ position: "absolute", right: "25px" }} onClick={() => setEditMode(true)}>
        Update profile
      </Button>
      <div
        className="pointer"
        style={{
          borderRadius: "125px",
          overflow: "hidden",
          width: "250px",
          height: "250px",
          margin: "0 auto 1rem auto",
          position: "relative",
        }}
      >
        <Image
          src={user.profilePicture || `https://via.placeholder.com/150`}
          alt="avatar"
          layout="fill"
          objectFit="cover"
        ></Image>
      </div>
      <Title className="align-center" level={2} style={{ margin: 0 }}>
        {user.name}
      </Title>
      <Title className="align-center" level={4} style={{ margin: 0 }}>
        NTRP Rating: {user.ntrp.toString()}
      </Title>
      {user.clubs &&
        user.clubs.map((club, index) => {
          return (
            <Title className="align-center" level={4} style={{ margin: 0 }} key={index}>
              Club: {club.name}
            </Title>
          );
        })}
      {user.profileVideo && (
        <div style={{ marginTop: "1.5rem" }}>
          <span>Profile Video</span>
        </div>
      )}
    </div>
  );
};

export { DisplayProfile };
