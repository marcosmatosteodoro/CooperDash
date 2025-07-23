import { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LayoutContext } from '../context/LayoutContext';
import whiteLogo from "../assets/images/logo_zallpy_white.png"
import blackLogo from "../assets/images/logo_zallpy_black.png"

const Header = () => {
  const { layoutData, toggleTheme } = useContext(LayoutContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 50) {
          headerRef.current.classList.add('scrolled');
        } else {
          headerRef.current.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <header ref={headerRef} className="main-header navbar navbar-expand-lg navbar-light fixed-top shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img 
            src={layoutData.theme === 'dark' ? whiteLogo : blackLogo}
            alt="Logo do Projeto" 
            height="50"
          />
        </Link>

        <div className="d-flex align-items-center">
          <button 
            className="btn border-0 text-decoration-none"
            onClick={toggleTheme}
            aria-label={layoutData.theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}>
            <i className={`bi ${layoutData.theme === 'dark' ? 'bi-moon' : 'bi-sun'}`} style={{ fontSize: '1.25rem' }}/>
          </button>

          <div className="vr my-1 mx-2"></div>

          <div className="dropdown">
            <button 
              className="btn border-0 text-decoration-none"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-expanded={showDropdown}
            >
              <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i>
            </button>

            <ul className={`dropdown-menu dropdown-menu-start ${showDropdown ? 'show' : ''}`}>
              <li><h6 className="dropdown-header">Conta</h6></li>
              <li>
                <Link className="dropdown-item" to="#">
                  <i className="bi bi-person me-2"></i> Perfil
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="#">
                  <i className="bi bi-gear me-2"></i> Configurações
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="#">
                  <i className="bi bi-shield-lock me-2"></i> Privacidade
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="#">
                  <i className="bi bi-bell me-2"></i> Notificações
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li><h6 className="dropdown-header">Ajuda</h6></li>
              <li>
                <Link className="dropdown-item" to="#">
                  <i className="bi bi-book me-2"></i> Guia de Ajuda
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="#">
                  <i className="bi bi-question-circle me-2"></i> Central de Ajuda
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item" onClick={() => console.log('Sign out')}>
                  <i className="bi bi-box-arrow-right me-2"></i> Sair
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;