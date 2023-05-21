import Image from "next/image";
import { Button, Typography } from "antd";

const { Title } = Typography;

const DisplayProfile = ({ user, setEditMode, userClubs }) => {
  const getVideoId = (url) => {
    return url.replace("/videos/", "");
  };

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
      <Title className="align-center" level={4} style={{ margin: 0, marginBottom: "10px" }}>
        NTRP Rating: {user.ntrp.toString()}
      </Title>
      {userClubs &&
        userClubs.map((club, index) => {
          console.log({ club });
          return (
            <Title className="align-center" level={4} style={{ margin: 0 }} key={index}>
              {club.name}
            </Title>
          );
        })}
      {user.profileVideo && (
        <div style={{ marginTop: "1.5rem" }}>
          <span>Profile Video</span>
          <iframe
            src={`https://player.vimeo.com/video/${getVideoId(user.profileVideo)}`}
            width="640"
            height="360"
            frameborder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export { DisplayProfile };
