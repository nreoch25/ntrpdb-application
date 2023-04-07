import { Card, List, Skeleton } from "antd";

import listingLoadingCardCover from "../../../../assets/listing-loading-card-cover.jpeg";

const ClubsSkeleton = () => {
  const emptyData = [{}, {}, {}, {}, {}, {}, {}, {}];

  return (
    <div>
      <Skeleton paragraph={{ rows: 1 }} />
      <List
        grid={{
          column: 4,
          gutter: 8,
          xs: 1,
          sm: 2,
          lg: 4,
        }}
        dataSource={emptyData}
        renderItem={() => (
          <List.Item>
            <Card
              cover={
                <div
                  style={{ backgroundImage: `url(${listingLoadingCardCover})` }}
                  className="clubs-skeleton__card-cover-img"
                ></div>
              }
              loading
              className="clubs-skeleton__card"
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export { ClubsSkeleton };
