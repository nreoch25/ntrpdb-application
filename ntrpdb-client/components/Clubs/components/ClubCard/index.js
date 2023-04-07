import { Card, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const ClubCard = ({ club }) => {
  const { id, name, website, address, photo } = club;
  const placeholder = "https://via.placeholder.com/150x100";

  return (
    <Card
      hoverable
      cover={<img alt="example" src={photo || placeholder} className="club-card__cover-img" />}
    >
      <div className="club-card__details">
        <div className="club-card__description">
          <Text strong ellipsis className="club-card__title">
            {name}
          </Text>
          <Text ellipsis className="club-card__address">
            {address}
          </Text>
        </div>
        <div className="club-card__dimensions club-card__dimensions--guests">
          <Text>Visit website</Text>
        </div>
      </div>
    </Card>
  );
};

export { ClubCard };
