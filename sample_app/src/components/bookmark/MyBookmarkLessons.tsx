import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { LessonItem, LessonItemIProps } from '../lesson/lessonlist/LessonItem';
import * as BookmarkAPI from '../../lib/api/bookmark';
import { ICategoryTable } from '../../types/categoryData';
import getCategoriesByMap from '../../lib/getCategoriesByMap';
import Button from '../common/Button';
import palette from '../../style/palette';

/**
 * 버튼 컴포넌트입니다.
 * styled-components를 이용해 리액트 컴포넌트로 만들어 스타일을 적용합니다.
 * 
 * @author joohongpark
 */
export const StyledButton = styled(Button)`
  background-color: ${palette.green};
  font-size: 15px;
  width: 80px;
  height: 40px;
  border-radius: 3px;
  margin-left: 5px;
  box-shadow: unset;
  border: 0.05rem solid ${palette.darkBlue};
  .buttonText {
    margin: 0;
    color: ${palette.darkBlue};
  }
`;

/**
 * 헤더 아이템을 감싸는 컴포넌트입니다.
 * styled-components를 이용해 리액트 컴포넌트로 만들어 스타일을 적용합니다.
 * 
 * @author joohongpark
 */
export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

/**
 * 짧은 텍스트 라벨을 붙이는 컴포넌트입니다.
 * styled-components를 이용해 리액트 컴포넌트로 만들어 스타일을 적용합니다.
 * 
 * @author joohongpark
 */
const Label = styled.div`
  font-family: "Roboto","Arial",sans-serif;
  font-size: 1.6rem;
  line-height: 2.2rem;
  font-weight: 400;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
`;

export default function MyBookmarkLessons() {
  const [lessons, setLessons] = useState<ReadonlyArray<LessonItemIProps>>([]);
  const [edit, setEdit] = useState<boolean>(false);

  async function getBookmarks() {
    try {
      const categoriesMap = await getCategoriesByMap();
      const bookmarksRes = await BookmarkAPI.getLessonBookmarks();
      const categories = bookmarksRes.data.data.map((c: any) => ({
        lesson_id: c.lesson_id,
        category: categoriesMap.get(c.Lesson.category_id),
        title: c.Lesson.content,
      }));
      setLessons(categories);
    } catch (e) {
      console.log(e, '좋아요한 강의 목록을 불러오지 못했습니다.');
    }
  }

  useEffect(() => {
    getBookmarks();
  }, []);

  const del = async (lesson_id: number) => {
    if (Number.isNaN(lesson_id))
      return ;
    try {
      let result = await BookmarkAPI.delLessonBookmark(lesson_id);
      await getBookmarks();
    } catch (e) {
      alert("북마크를 삭제하는 데 오류가 발생하였습니다.");
      console.log(e, '북마크를 삭제하는 데 오류가 발생하였습니다.');
    }
  };

  return (
    <>
    {
      lessons.length !== 0 ?
        <>
        <HeaderWrapper>
          <Label>
            북마크 한 강의 목록
          </Label>
          <StyledButton
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setEdit(!edit);
            }}>
              {edit ? "수정 완료" : "목록 수정"}
          </StyledButton>
        </HeaderWrapper>
        {
          lessons.map((lessons) =>
            <LessonItem
              lesson_id={lessons.lesson_id}
              category={lessons.category}
              title={lessons.title}
              key={lessons.lesson_id}
              del={edit ? del : undefined}
            />
          )
        }
        </>
        : <Label>북마크 한 강의가 없습니다.</Label>
      }
    </>
  );
}
