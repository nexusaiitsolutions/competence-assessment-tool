// import React from 'react';
// import { NavLink } from 'react-router-dom';


// const Item = ({ to, label }) => (
// <NavLink to={to} className={({isActive}) => isActive ? 'badge' : ''} style={{ display:'block', padding:'10px 8px', borderRadius:12, marginBottom:6 }}>
// {label}
// </NavLink>
// );


// export default function Sidebar(){
// return (
// <div>
// <h2 style={{margin:'0 0 16px'}}>CAT</h2>
// <div style={{color:'#6b7280', fontSize:12, textTransform:'uppercase', letterSpacing:1}}>Navigation</div>
// <div style={{marginTop:8}}>
// <Item to="/" label="Dashboard"/>
// <Item to="/skills" label="Skills"/>
// <Item to="/assessments" label="Assessments"/>
// <Item to="/competencies" label="Competencies"/>
// <Item to="/training" label="Training"/>
// <Item to="/projects" label="Projects"/>
// <Item to="/reports" label="Reports"/>
// </div>
// </div>
// );
// }

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Layers,
  FileCheck,
  Award,
  BookOpen,
  FolderKanban,
  LineChart,
  Menu,
  AlignCenter,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/skills", label: "Skills", icon: Layers },
  { to: "/assessments", label: "Assessments", icon: FileCheck },
  { to: "/competencies", label: "Competencies", icon: Award },
  { to: "/training", label: "Training", icon: BookOpen },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/reports", label: "Reports", icon: LineChart },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        {!collapsed && <h2 className="text-xl font-bold text-primary"></h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn btn-secondary btn-sm"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Navigation */}
      <div>
        {!collapsed && (
          <div className="text-xs text-secondary font-semibold uppercase tracking-wider mb-2 px-2">
            Menu
          </div>
        )}
        {navItems.map(({ to, label, icon: Icon }) => (
         <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
                `nav-link flex items-center gap-5 px-3 py-2 ${isActive ? "active" : ""}`
            }
            title={collapsed ? label : ""}
            >
            <Icon size={20} className="shrink-0" style={{ verticalAlign: "bottom" }} /> &nbsp;
            {!collapsed && (
                <span className="flex-1 text-center" style={{ verticalAlign: "middle" }}>
                {label}
                </span>
            )}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}




