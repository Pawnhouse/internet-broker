import { SIGN_IN_PATH, SIGN_UP_PATH, PANEL_PATH, PROFILE_PATH, STOCK_PATH, WITHDRAWAL_PATH, DEPOSIT_PATH, INFO_PATH, ARTICLE_PATH, ADMIN_PATH } from './paths';
import Auth from  '../pages/Auth';
import Profile from '../pages/Profile';
import Panel from '../pages/Panel';
import Markets from '../pages/Markets';
import Balance from '../pages/Balance';
import Info from '../pages/Info';
import Article from '../pages/Article';
import AdminPanel from '../pages/Admin';

export const publicRoutes = [
  {
    path: SIGN_IN_PATH,
    Component: Auth
  },
  {
    path: SIGN_UP_PATH,
    Component: Auth
  },
]

export const authRoutes = [
  {
    path: PROFILE_PATH,
    Component: Profile
  },  
  {
    path: PANEL_PATH,
    Component: Panel
  },  
  {
    path: STOCK_PATH,
    Component: Markets
  },
  {
    path: WITHDRAWAL_PATH,
    Component: Balance
  },
  {
    path: DEPOSIT_PATH,
    Component: Balance
  },
  {
    path: INFO_PATH + '/:id',
    Component: Info
  },
  {
    path: ARTICLE_PATH + '/:id',
    Component: Article
  },
  {
    path: ADMIN_PATH,
    Component: AdminPanel
  },  
]
