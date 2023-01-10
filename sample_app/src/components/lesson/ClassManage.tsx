import { useEffect, useState } from 'react';
import styled from 'styled-components';
import palette from '../../style/palette';
import Button from '../common/Button';
import { LessonItem } from './lessonlist/LessonItem';
import * as LessonAPI from '../../lib/api/lesson';
import * as ProfileAPI from '../../lib/api/profile';
import { IUserTable } from '../../types/userData';
import { ILessonData } from '../../types/lessonData';
import Pagination from '../common/Pagination';

const ClassManageContainer = styled.div`
  margin-bottom: 76px;
`;

const WriteBtnWrapper = styled.div`
  padding: 80px 30px;
  border-bottom: 1px solid ${palette.darkBlue};
`;

const StyledButton = styled(Button)`
  ::before {
    padding-top: 50%;
  }
`;

const ClassListWrapper = styled.div`
  padding: 30px 30px 10px 30px;
  font-weight: bold;
  font-size: 17px;
  color: ${palette.darkBlue};
  .classList {
    margin-top: 20px;
  }
`;

export default function ClassManage() {
  const userLogged = localStorage.getItem('user');
  const [userData, setUserData] = useState<IUserTable>();
  const [myClasses, setMyClasses] = useState<ReadonlyArray<ILessonData>>([]);
  const [classCount, setClassCount] = useState<number>(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const itemsPerPage = 5;

  const handlePageClick = async (event: any) => {
    if (userData) {
      const newOffset = (event.selected * itemsPerPage) % classCount;
      try {
        const res = await LessonAPI.getLessonByUserId(
          userData.id,
          itemsPerPage,
          newOffset,
        );
        setMyClasses(res.data.data);
      } catch (e) {
        console.log(e, 'id로 레슨을 불러오지 못했습니다.');
      }
    }
  };

  const onClickDelete = async (id: number) => {
    if (confirm(`이 글을 삭제하시겠습니까?`)) {
      try {
        await LessonAPI.deleteLessonById(id);
        setIsUpdate(prev => !prev);
      } catch (e) {
        console.log(e, '삭제를 실패했습니다.');
      }
    }
  };

  useEffect(() => {
    async function getMyProfile() {
      try {
        const userProfile = await ProfileAPI.getMyProfile();
        setUserData(userProfile.data.data);
      } catch (e) {
        console.log(e, '내 프로필을 불러오지 못했습니다.');
      }
    }
    if (userLogged) {
      getMyProfile();
    }
  }, []);

  useEffect(() => {
    async function getMyLessons(id: number, limit: number, offset: number) {
      try {
        const res = await LessonAPI.getLessonByUserId(id, limit, offset);
        setMyClasses(res.data.data);
        setClassCount(res.data.data.length);
      } catch (e) {
        console.log(e, 'id로 레슨을 불러오지 못했습니다.');
      }
    }
    if (userData) {
      getMyLessons(userData.id, itemsPerPage, 0);
    }
  }, [userData, isUpdate]);

  return (
    <ClassManageContainer>
      <WriteBtnWrapper>
        <StyledButton to="/lesson/write">레슨 글 등록하기</StyledButton>
      </WriteBtnWrapper>
      <ClassListWrapper>
        등록된 레슨
        <div className="classList">
          {myClasses &&
            myClasses.map(lesson => (
              <LessonItem
                lesson_id={lesson.id}
                category={lesson.Category.name || ""}
                title={lesson.title || ""}
                key={lesson.id}
                image_url={lesson.User.image_url}
                del={onClickDelete}
                editable
                />
            ))}
        </div>
      </ClassListWrapper>
      <Pagination
        itemsPerPage={itemsPerPage}
        classCount={classCount}
        handlePageClick={e => handlePageClick(e)}
      />
    </ClassManageContainer>
  );
}
