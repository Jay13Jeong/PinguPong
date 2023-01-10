import { useState, useEffect } from 'react';
import MUITable from '../components/Table/MUITable';
import * as Api from '../lib/api';

function delUsers(arr: ReadonlyArray<number>) {
  Api.deleteUsers(arr, false)
  .then(res => console.log(`${res.data.data}명의 유저 삭제`))
  .catch(e => console.log(`err : ${e}`));
}

export default function UserListPage() {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [rows, setRows] = useState<[]>([]);
  const [count, setCount] = useState(0);

  /**
   * Page 전환
   */
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  /**
   * 한 페이지에 노출하는 row수
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getUsers = () => {
    // FIXME: Offset 추가해야 할듯?
    Api.getAppUserList(page).then(({ data }: any) => {
      setRows(data.data.rows);
      setCount(parseInt(data.data.count, 10));
    });
  }

  useEffect(() => {
    getUsers();
  }, [page]);

  return (
    <>
      <MUITable
        page={page}
        count={count}
        rows={rows}
        rowsPerPage={rowsPerPage}
        onClickDeleteButton={(arr) => {
          delUsers(arr);
          getUsers();
        }}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
}
