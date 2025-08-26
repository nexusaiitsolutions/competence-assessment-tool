import React from 'react';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';


export default function Layout({ children }){
return (
<div className="app">
<aside className="sidebar"><Sidebar/></aside>
<main className="main">
<div className="topbar"><Topbar/></div>
<div className="container">{children}</div>
</main>
</div>
);
}