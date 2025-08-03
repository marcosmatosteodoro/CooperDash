'use client'

import Link from 'next/link';
import { useState } from 'react';
import { ProfileDropdownProps, ProfileDropdownItemsType } from '../types'

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({items}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getItemType = (item: ProfileDropdownItemsType) => {
    const types = {
      header: <h6 className="dropdown-header">{item.text}</h6>,
      divider:  <hr className="dropdown-divider" />,
      item: <Link className="dropdown-item" href="#">
              <i className={`bi ${item.icon} me-2`}></i> {item.text}
            </Link>
    }
    return types[item.type]
  }

  return (
    <div className="dropdown" data-testid="profile-dropdown">
      <button 
        data-testid="profile-dropdown-button"
        aria-label="Abrir menu do perfil"
        className="btn border-0 text-decoration-none"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-expanded={showDropdown}
      >
        <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i>
      </button>
      <ul className={`dropdown-menu dropdown-menu-start ${showDropdown ? 'show' : ''}`}>
        { items.map(( item, index) => <li key={index}> {getItemType(item)}</li> )}
        <li>
          <button className="dropdown-item" onClick={() => console.log('Sign out')}>
            <i className="bi bi-box-arrow-right me-2"></i> Sair
          </button>
        </li>
      </ul>
    </div>
  );
};