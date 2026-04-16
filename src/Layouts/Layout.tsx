import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="bg-gray-100 flex h-[90vh] w-full overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
