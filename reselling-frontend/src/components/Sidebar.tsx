import React from "react";
import { Link, useLocation } from "react-router-dom";

interface LinkItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  const location = useLocation();

  const links: LinkItem[] = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" }, // ✅ fixed path
    { name: "Items", path: "/items", icon: "📦" },
    { name: "Sales", path: "/sales", icon: "💰" },
    { name: "Profit / Loss", path: "/profitLoss", icon: "📊" },
  ];

  return (
    <div
      style={{
        width: isOpen ? "200px" : "60px",
        background: "#1e293b",
        color: "white",
        transition: "width 0.3s ease",
        padding: "10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          onClick={toggle}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          ☰
        </button>
        {isOpen && <h2 style={{ marginLeft: "10px" }}>Menu</h2>}
      </div>

      <nav style={{ marginTop: "20px" }}>
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              marginBottom: "8px",
              borderRadius: "8px",
              textDecoration: "none",
              color: location.pathname === link.path ? "#38bdf8" : "white",
              backgroundColor:
                location.pathname === link.path ? "#0f172a" : "transparent",
              fontSize: "15px",
            }}
          >
            <span style={{ fontSize: "18px", marginRight: isOpen ? "10px" : 0 }}>
              {link.icon}
            </span>
            {isOpen && link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
