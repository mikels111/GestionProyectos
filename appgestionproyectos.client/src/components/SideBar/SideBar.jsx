import React from 'react';
import { BeakerIcon, Squares2X2Icon } from '@heroicons/react/16/solid'
import './SideBar.css'
function SideBar() {
    return (
        <React.Fragment>
            <aside className="sidebar">
                {/*Sidebar header */}
                <header className="sidebar-header">
                    <a href="#" className="header-logo">
                        <img src="logo.png" alt="CodingNepal" />
                    </a>
                    <button className="toggler sidebar-toggler">
                        <span className="material-symbols-rounded">chevron_left</span>
                    </button>
                    <button className="toggler menu-toggler">
                        <span className="material-symbols-rounded">menu</span>
                    </button>
                </header>
                <nav className="sidebar-nav">
                    {/*Primary top nav*/}
                    <ul className="nav-list primary-nav">
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <span className="nav-icon material-symbols-rounded">
                                    <Squares2X2Icon className="w-[20px] h-[20px] text-gray-500" style={{ width: '30px', height: '30px' }} />
                                </span>
                                <span className="nav-label">Dashboard</span>
                            </a>
                            <span className="nav-tooltip">Dashboard</span>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <span className="nav-icon material-symbols-rounded">calendar_today</span>
                                <span className="nav-label">Calendar</span>
                            </a>
                            <span className="nav-tooltip">Calendar</span>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <span className="nav-icon material-symbols-rounded">notifications</span>
                                <span className="nav-label">Notifications</span>
                            </a>
                            <span className="nav-tooltip">Notifications</span>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <span className="nav-icon material-symbols-rounded">group</span>
                                <span className="nav-label">Team</span>
                            </a>
                            <span className="nav-tooltip">Team</span>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <span className="nav-icon material-symbols-rounded">insert_chart</span>
                                <span className="nav-label">Analytics</span>
                            </a>
                            <span className="nav-tooltip">Analytics</span>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <span className="nav-icon material-symbols-rounded">star</span>
                                <span className="nav-label">Bookmarks</span>
                            </a>
                            <span className="nav-tooltip">Bookmarks</span>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <span className="nav-icon material-symbols-rounded">settings</span>
                                <span className="nav-label">Settings</span>
                            </a>
                            <span className="nav-tooltip">Settings</span>
                        </li>
                    </ul>
                    {/*Secondary bottom nav*/}
                    <ul className="nav-list secondary-nav">
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <span className="nav-icon material-symbols-rounded">account_circle</span>
                                <span className="nav-label">Profile</span>
                            </a>
                            <span className="nav-tooltip">Profile</span>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <span className="nav-icon material-symbols-rounded">logout</span>
                                <span className="nav-label">Logout</span>
                            </a>
                            <span className="nav-tooltip">Logout</span>
                        </li>
                    </ul>
                </nav>
            </aside>
        </React.Fragment>
    );
}

export default SideBar;