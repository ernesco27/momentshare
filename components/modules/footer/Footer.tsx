import React from "react";

const Footer = () => {
  return (
    <footer className="py-8 text-center text-gray-500 text-sm">
      © {new Date().getFullYear()} MomentShare. All rights reserved.
    </footer>
  );
};

export default Footer;
