import React, { useState, useEffect, useCallback } from 'react';
import ModalAddUser from './Modal_add_user';
import closeIcon from '/images/Icon ionic-ios-close-circle.png';
import logo from '/images/logo.png';
import './Modal_add_user.css';
import './App.css';
import './index.css';

function Call_Table_Users({ onClick }) {
    return (
      <button className="add-button" onClick={onClick}>Добавить</button>
    );
}

function EditModal({ user, onClose, onSave }) {
  const [editedUser, setEditedUser] = useState(user);

  const handleSubmit = () => {
    if (!editedUser.name || !editedUser.company || editedUser.group === 'Выбрать') {
      if (editedUser.group === 'Выбрать') {
        alert('Пожалуйста, выберите группу');
      } else {
        alert('Пожалуйста, заполните все поля');
      }
      return;
    }
    onSave(editedUser);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-button-x" aria-label="Close modal">
          <img src={closeIcon} alt="Close" className="close-icon" />
        </button>
        <div className="modal-form">
          <div className="modal-form-row">
            <h4 className="modal-label">ФИО</h4>
            <input 
              type="text" 
              className="modal-input"
              value={editedUser.name}
              onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
            />
          </div>

          <div className="modal-form-row">
            <h4 className="modal-label">Компания</h4>
            <input 
              type="text" 
              className="modal-input"
              value={editedUser.company}
              onChange={(e) => setEditedUser({...editedUser, company: e.target.value})}
            />
          </div>

          <div className="modal-form-row">
            <h4 className="modal-label">Группа</h4>
            <select 
              className="modal-select"
              value={editedUser.group}
              onChange={(e) => setEditedUser({...editedUser, group: e.target.value})}
            >
              <option value="Выбрать">Выбрать</option>
              <option value="Прохожий">Прохожий</option>
              <option value="Клиент">Клиент</option>
              <option value="Партнер">Партнер</option>
            </select>
          </div>

          <div className="modal-form-row modal-checkbox-container">
            <h4 className="modal-label">Присутствие</h4>
            <input 
              type="checkbox" 
              className="modal-checkbox"
              checked={editedUser.isPresent}
              onChange={(e) => setEditedUser({...editedUser, isPresent: e.target.checked})}
            />
          </div>

          <div className="modal-button-container">
            <button className="modal-button modal-button-add" onClick={handleSubmit}>
              Сохранить
            </button>
            <button className="modal-button modal-button-close" onClick={onClose}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContextMenu({ x, y, onEdit}) {
  return (
    <div className="context-menu" style={{ top: y, left: x }}>
      <div className="context-menu-item" onClick={onEdit}>
        Редактировать
      </div>
    </div>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(savedUsers);

    const handleClickOutside = () => {
      setContextMenu(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleAddUser = (newUser) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleEditUser = (editedUser) => {
    const updatedUsers = users.map(user => 
      user.id === editedUser.id ? editedUser : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setEditingUser(null);
  };

  const handleContextMenu = useCallback((e, user) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      user
    });
  }, []);

  const handleTogglePresence = (userId) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, isPresent: !user.isPresent } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchLower) ||
      user.company?.toLowerCase().includes(searchLower) ||
      user.group?.toLowerCase().includes(searchLower);
    
    switch(filterType) {
      case 'absent':
        return matchesSearch && !user.isPresent;
      case 'present':
        return matchesSearch && user.isPresent;
      default:
        return matchesSearch;
    }
  });

  const presentCount = users.filter(user => user.isPresent).length;
  const absentCount = users.filter(user => !user.isPresent).length;

  return (
    <main>
      <header>
        <div className="header-container">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="logo" className="main_logo" />
            <div className="search-container">
              <input
                type="text"
                className="search-input-text"
                placeholder="Поиск по имени"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Call_Table_Users onClick={() => setIsModalOpen(true)} />
          </div>
          <div className="visitors-info-container">
            <h4 id="visitors-info-title">Посетители</h4>
            <div id="visitors-info-count">
              <span id="visitors-info-online">{presentCount}</span>
              <span className="visitors-info" style={{ color: '#4E3000', padding: '0 4px' }}>/</span>
              <span>{absentCount}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="main-container">
        <div className="main-container-header">
          <div className="main-container-info-person-header">
            <div id="main-container-info-person-header-number">
              <h5>Номер</h5>
            </div>
            <div id="main-container-info-person-header-name">
              <h5>ФИО</h5>
            </div>
            <div id="main-container-info-person-header-company">
              <h5>Компания</h5>
            </div>
            <div id="main-container-info-person-header-group">
              <h5>Группа</h5>
            </div>
            <div className="main-container-info-person-header-online">
              <h5>Присутствие</h5>
            </div>
          </div>
        </div>

        {filteredUsers.map(user => (
          <div 
            key={user.id} 
            className="main-container-info-person"
            onContextMenu={(e) => handleContextMenu(e, user)}
          >
            <div className="main-container-info-person-data">
              <div className="main-container-info-person-number">
                <span>{user.number}</span>
              </div>
              <div className="main-container-info-person-name">
                <span>{user.name}</span>
              </div>
              <div className="main-container-info-person-company">
                <span>{user.company}</span>
              </div>
              <div className="main-container-info-person-group">
                <span>{user.group}</span>
              </div>
            </div>
            <div 
              className="main-container-info-person-online"
              onClick={() => handleTogglePresence(user.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className={`presence-indicator ${user.isPresent ? 'present' : 'absent'}`}></div>
            </div>
          </div>
        ))}
      </div>

      <footer>
        <div className="footer-content">
          <h5>Фильтровать по:</h5>
          <div className="filter-options">
            <button 
              className={`filter-button ${filterType === 'absent' ? 'active' : ''}`}
              onClick={() => setFilterType(filterType === 'absent' ? 'all' : 'absent')}
            >
              Отсутствующим
            </button>
            <button 
              className={`filter-button ${filterType === 'present' ? 'active' : ''}`}
              onClick={() => setFilterType(filterType === 'present' ? 'all' : 'present')}
            >
              Присутствующим
            </button>
            <button 
              className={`filter-button ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              Без фильтра
            </button>
          </div>
        </div>
      </footer>

      {isModalOpen && <ModalAddUser onClose={() => setIsModalOpen(false)} addUser={handleAddUser} />}
      {editingUser && <EditModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleEditUser} />}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onEdit={() => {
            setEditingUser(contextMenu.user);
            setContextMenu(null);
          }}
          onClose={() => setContextMenu(null)}
        />
      )}
    </main>
  );
}

export default App;
