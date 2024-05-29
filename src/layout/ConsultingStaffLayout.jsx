import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/ConsultingStaff/Sidebar";
import AppHeader from "../components/ConsultingStaff/AppHeader";

const { Sider, Content } = Layout;

const ConsultingStaffLayout = () => {
  return (
    <Layout>
      <Sider>
        <Sidebar />
      </Sider>
      <Layout>
        <AppHeader />
        <div
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Content
            style={{
              padding: "30px",
              background: "#ffffff",
              margin: "90px 20px",
              borderRadius: "10px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Outlet />
          </Content>
        </div>
      </Layout>
    </Layout>
  );
};

export default ConsultingStaffLayout;
