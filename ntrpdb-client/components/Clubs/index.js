import { useState } from "react";
import { Affix, Layout, List, Typography } from "antd";
import { useClubsQuery } from "../../hooks/useClubsQuery";
import { ClubsPagination } from "./components/ClubsPagination";
import { ClubCard } from "./components/ClubCard";
import { ClubsSkeleton } from "./components/ClubsSkeleton";

const PAGE_LIMIT = 24;

const { Content } = Layout;
const { Item } = List;

const Clubs = () => {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useClubsQuery({ limit: PAGE_LIMIT, page });

  if (loading) {
    return (
      <Content className="content">
        <ClubsSkeleton />
      </Content>
    );
  }

  if (error) {
    return <div>Error</div>;
  }

  const clubs = data ? data.clubs : null;

  return (
    <Content className="content">
      {clubs && clubs.result.length ? (
        <div>
          <Affix offsetTop={64} className="align-right mb-10">
            <ClubsPagination total={clubs.total} page={page} limit={PAGE_LIMIT} setPage={setPage} />
          </Affix>
          <List
            grid={{
              column: 4,
              gutter: 8,
              xs: 1,
              sm: 2,
              lg: 4,
            }}
            dataSource={clubs.result}
            renderItem={(club) => (
              <Item>
                <ClubCard club={club} />
              </Item>
            )}
          />
        </div>
      ) : null}
    </Content>
  );
};

export { Clubs };
