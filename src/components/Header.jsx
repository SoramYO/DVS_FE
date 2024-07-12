import {
  ClockCircleOutlined,
  DownOutlined,
  MailFilled,
  PhoneFilled
} from "@ant-design/icons";
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "../css/Header.css";
import Contact from "../pages/Contact";
import Logo from "../assets/imgs/logoweb.png";

const Header = () => {
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);

  const showContactModal = () => {
    setIsContactModalVisible(true);
  };

  const handleContactClose = () => {
    setIsContactModalVisible(false);
  };

  return (
    <div className="headerContainer">
      <div className="headerLeft">
        {/* <div className="languageIcon">
          <img src="../assets/language.png" alt="Language" className="languageIconImage" />
        </div>
        <DownOutlined className="downIcon" />
        <h4>English</h4> */}
        <div className="clockContainer">
          <ClockCircleOutlined className="headerIcon" />
          <h5>8:00 - 21:00</h5>
        </div>
      </div>
      <div className="headerCenter">
        <Link to="/">
          <img src={Logo} alt="Logo" className="headerLogo" />
        </Link>
      </div>
      <div className="headerRight">
        <MailFilled className="headerIcon emailIcon" onClick={showContactModal} />
        
        <div className="phoneContainer">
          <PhoneFilled className="headerIcon" />
          <h5>0976457150</h5>
        </div>
      </div>
      <Contact visible={isContactModalVisible} onClose={handleContactClose} />
    </div>
  );
};

export default Header;
