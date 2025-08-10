'use client';

import { TablePagination } from "@mui/material";
import { useRouter } from "next/navigation";

interface PostsPaginationProps {
  page: number;
  limit: number;
  total: number;
}

export default function PostsPagination({ page, limit, total }: PostsPaginationProps) {
  const router = useRouter();

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    router.push(`/?page=${newPage + 1}&limit=${limit}`);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newLimit = parseInt(event.target.value, 10);
    router.push(`/?page=1&limit=${newLimit}`);
  };

  return (
    <TablePagination
      component="div"
      count={total}
      page={page - 1}
      onPageChange={handleChangePage}
      rowsPerPage={limit}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[]}
    />
  );
}
