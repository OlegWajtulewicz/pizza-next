'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input } from '@/shared/components';
import toast from 'react-hot-toast';
import { createUser, deleteUser } from '@/app/actions';
import { UserRole } from '@prisma/client';

interface User {
  id: number;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN";
}

const roles = Object.values(UserRole);

export default function DashboardUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    password: '',
    role: "USER",
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error('Не удалось загрузить пользователей');
    }
  };

  const handleCreateUser = async () => {
    try {
      await createUser({
        ...newUser,
        role: newUser.role as UserRole, // Убедитесь, что роль преобразована в тип UserRole
      });
      toast.success('Пользователь создан');
      setNewUser({ fullName: '', email: '', password: '', role: UserRole.USER });
      fetchUsers();
    } catch (error) {
      toast.error('Ошибка создания пользователя');
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      toast.success('Пользователь удалён');
      fetchUsers();
    } catch (error) {
      toast.error('Ошибка удаления пользователя');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

    // Преобразование строки в UserRole
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roleValue = e.target.value as keyof typeof UserRole;
    setNewUser({ ...newUser, role: UserRole[roleValue] });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Управление пользователями</h1>
      
      {/* Форма создания нового пользователя */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Создать нового пользователя</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input 
            value={newUser.fullName}
            onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
            placeholder="Полное имя"
          />
          <Input 
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="E-mail"
          />
          <Input 
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            placeholder="Пароль"
          />
          <select
            value={newUser.role}
            onChange={handleRoleChange} // Используем обработчик для преобразования строки в UserRole
            className="p-1 border border-gray-200 rounded text-gray-500 text-sm"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <Button className='h-9' onClick={handleCreateUser}>Создать</Button>
        </div>
      </div>

      {/* Таблица пользователей */}
      <table className="min-w-full table-auto border-collapse border border-slate-500">
        <thead>
          <tr className="bg-gray-200 border border-gray-300 ">
            <th className="px-2 py-2">ID</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td className='text-center'>
                <Button className="h-[1.7rem]" onClick={() => handleDeleteUser(user.id)}>Удалить</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
