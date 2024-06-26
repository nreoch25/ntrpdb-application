import { Fragment } from "react";
import { Skeleton } from "antd";

const PageSkeleton = () => {
  const skeletonParagraph = (
    <Skeleton active paragraph={{ rows: 4 }} className="page-skeleton__paragraph" />
  );

  return (
    <Fragment>
      {skeletonParagraph}
      {skeletonParagraph}
      {skeletonParagraph}
    </Fragment>
  );
};

export { PageSkeleton };
