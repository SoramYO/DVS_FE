import {
  ClockCircleOutlined,
  DownOutlined,
  MailFilled,
  PhoneFilled
} from "@ant-design/icons";
import React, { useState } from 'react';
import "../css/Header.css";
import Contact from "../pages/Contact";

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
        <div className="languageIcon">
          <img src="../assets/language.png" alt="Language" className="languageIconImage" />
        </div>
        <DownOutlined className="downIcon" />
        <h4>English</h4>
      </div>
      <div className="headerRight">
        <MailFilled className="headerIcon emailIcon" onClick={showContactModal} />
        <div className="clockContainer">
          <ClockCircleOutlined className="headerIcon" />
          <h5>8:00 - 21:00</h5>
        </div>
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
