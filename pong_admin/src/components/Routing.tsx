import styled from 'styled-components';
import { Route, Routes } from 'react-router';
import HomePage from '../pages/HomePage';
import LessonListPage from '../pages/LessonListPage';
import LessonInfoPage from '../pages/LessonInfoPage';
import UserListPage from '../pages/UserListPage';
import AdminUserPage from '../pages/AdminUserPage';
import AdminUserInfoPage from '../pages/AdminUserInfoPage';
import InfoProvider from '../contexts/info';
import UserInfoPage from '../pages/UserInfoPage';
import PasswordChangePage from '../pages/PasswordChangePage';
import CommentListPage from '../pages/CommentListPage';
import EditTermsPage from '../pages/EditTermsPage';
import EditLicensePage from '../pages/EditLicensePage';

export default function Routing() {
  return (
    <RoutesContainer>
      <InfoProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UserListPage />} />
          <Route path="/users/:id" element={<UserInfoPage />} />
          <Route path="/admin_users" element={<AdminUserPage />} />
          <Route path="/admin_users/:id" element={<AdminUserInfoPage />} />
          <Route path="/lessons" element={<LessonListPage />} />
          <Route path="/license" element={<EditLicensePage />} />
          <Route path="/terms" element={<EditTermsPage />} />
          <Route path="/comments" element={<CommentListPage />} />
          <Route path="/lessons/:id" element={<LessonInfoPage />} />
          <Route path="/auth/password" element={<PasswordChangePage />} />
        </Routes>
      </InfoProvider>
    </RoutesContainer>
  );
}

const RoutesContainer = styled.div`
  position: relative;
  padding: 8rem 3rem 3rem 3rem;
  min-width: 110rem;
  justify-content: right;
  font-size: 1.6rem;
`;
