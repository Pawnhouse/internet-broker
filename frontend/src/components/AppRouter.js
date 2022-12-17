import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { adminRoutes, authRoutes, publicRoutes } from '../utils/routes';
import { PANEL_PATH, SIGN_IN_PATH, SIGN_UP_PATH } from '../utils/paths';
import { Context } from '../index';

function AppRouter() {
  const { userInfo } = React.useContext(Context);
  return (
    <Routes>
      {
        userInfo?.user?.role === 'administrator' &&
        adminRoutes.map(({ path, Component }) =>
          <Route key={path} path={path} element={<Component />} exact />
        )
      }
      {
        userInfo.isAuthenticated &&
        authRoutes.map(({ path, Component }) =>
          <Route key={path} path={path} element={<Component />} exact />
        )
      }
      {
        userInfo.isAuthenticated &&
        <>
          <Route path="/" element={<Navigate to={PANEL_PATH} />} />
          <Route path={SIGN_IN_PATH} element={<Navigate to={PANEL_PATH} />} />
          <Route path={SIGN_UP_PATH} element={<Navigate to={PANEL_PATH} />} />
        </>
      }
      {
        publicRoutes.map(({ path, Component }) =>
          <Route key={path} path={path} element={<Component />} exact />
        )
      }
      {
        !userInfo.isAuthenticated && <Route path="/" element={<Navigate to={SIGN_IN_PATH} />} />
      }
      <Route path="*" element={<p className='blur error-not-found'>Error 404. Wrong path</p>} />
    </Routes>
  )
}

export default AppRouter;