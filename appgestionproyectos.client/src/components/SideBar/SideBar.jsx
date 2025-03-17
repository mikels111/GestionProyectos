import React from 'react';
import './SideBar.css'
function SideBar() {
    return (
        <React.Fragment>
            <div className="sidebar">
                <ul>
                    <li><a href="#">Inicio</a></li>
                    <li><a href="#">Servicios</a></li>
                    <li><a href="#">Contacto</a></li>
                </ul>
            </div>
        </React.Fragment>
    );
}

export default SideBar;