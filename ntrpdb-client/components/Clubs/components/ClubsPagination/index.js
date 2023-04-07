import { Pagination } from "antd";

const ClubsPagination = ({ total, page, limit, setPage }) => {
  return (
    <Pagination
      showSizeChanger={false}
      current={page}
      total={total}
      defaultPageSize={limit}
      hideOnSinglePage
      showLessItems
      onChange={(page) => setPage(page)}
    />
  );
};

export { ClubsPagination };
