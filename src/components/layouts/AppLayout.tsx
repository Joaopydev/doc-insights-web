import { Outlet } from "react-router-dom";

import SideBar from "./SideBar";

function AppLayout() {
  
  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />

      <main className="flex-1 min-w-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;