import styled from 'styled-components';
import Title from '../Common/Title';

export default function AdminMemo() {
  return (
    <>
      <Title>관리자 메모</Title>
      <EmptyBox />
    </>
  );
}

const EmptyBox = styled.div`
  height: 10rem;
`;
