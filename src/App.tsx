import "./App.scss";
import Header from "./features/Header";
import { Outlet } from "react-router-dom";
import SideBar from "./features/SideBar";
function App() {
  return (
    <div className='App d-flex'>
      <Header></Header>
      <div className='Cotainer '>
        <SideBar></SideBar>
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default App;
