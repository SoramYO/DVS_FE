import { FileOutlined, ExceptionOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/imgs/logoweb.png";

const { Sider } = Layout;


const Sidebar = () => {
  return (
    <Sider
      style={{
        height: "100vh",
        position: "fixed",
        background: "#000000",
      }}
    >
      <div
      >
        <img
          // src="https://t4.ftcdn.net/jpg/02/39/44/75/360_F_239447528_qWYSonUIwGoNC290SfOBq8Gvy3x8ownV.jpg"
          src={Logo}
          alt="Logo"
          style={{ width: "80%", height: "80%", marginLeft:"20px" }}
        />
      </div>
      <Menu theme='dark' defaultSelectedKeys={["1"]} mode="inline">
        <Menu.Item key="1" icon={<FileOutlined />}>
          <Link to="/valuationStaff">Requests</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<ExceptionOutlined />}>
          <Link to="/valuationStaff/takedRequest">Request received</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default Sidebar