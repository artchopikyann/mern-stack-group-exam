import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = ({ user }) => {
    return (
        <div className="app-layout">
            <Header user={user} />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};
export default Layout;