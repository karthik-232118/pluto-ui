import { Skeleton } from "@mui/material";


const TableSkeleton = ({ rows }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} animation="wave" width="100%" height={60}  />
      ))}
    </>
  );
};

export default TableSkeleton;
