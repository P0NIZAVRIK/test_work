import React, { useState } from 'react';
import './Modal_add_user.css';
import closeIcon from '/images/Icon ionic-ios-close-circle.png';

function ModalAddUser({ onClose, addUser }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    group: 'Выбрать',
    isPresent: false
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.company || formData.group === 'Выбрать') {
      if (formData.group === 'Выбрать') {
        alert('Пожалуйста, выберите группу');
      } else {
        alert('Пожалуйста, заполните все поля');
      }
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = {
      id: Date.now(),
      number: users.length + 1,
      ...formData
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    if (addUser) {
      addUser(newUser);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-button-x">
          <img src={closeIcon} alt="Close" className="close-icon" />
        </button>
        <div className="modal-form">
          <div className="modal-form-row">
            <h4 className="modal-label">ФИО</h4>
            <input 
              type="text" 
              className="modal-input"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="modal-form-row">
            <h4 className="modal-label">Компания</h4>
            <input 
              type="text" 
              className="modal-input"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
          </div>

          <div className="modal-form-row">
            <h4 className="modal-label">Группа</h4>
            <select 
              className="modal-select"
              value={formData.group}
              onChange={(e) => setFormData({...formData, group: e.target.value})}
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
              checked={formData.isPresent}
              onChange={(e) => setFormData({...formData, isPresent: e.target.checked})}
            />
          </div>

          <div className="modal-button-container">
            <button className="modal-button modal-button-add" onClick={handleSubmit}>
              Добавить
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

export default ModalAddUser; 