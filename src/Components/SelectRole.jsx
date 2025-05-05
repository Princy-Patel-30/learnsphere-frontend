import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const SelectRole = () => {
  const { setUser, updateRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = async (selectedRole) => {
    if (loading) return;
    setLoading(true);
    try {
      const updatedUser = await updateRole(selectedRole);
      setUser(updatedUser);
      navigate(selectedRole === 'instructor' ? '/InstructorDashboard' : '/StudentDashboard');
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md text-center py-6 mb-10 rounded-xl bg-purple-100">
        <h2 className="text-2xl font-bold text-purple-700">Select Your Role</h2>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {['student', 'instructor'].map((role) => (
          <button
            key={role}
            onClick={() => handleRoleSelect(role)}
            disabled={loading}
            className="flex flex-col items-center gap-4 bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 w-36 h-36 sm:w-40 sm:h-40 rounded-xl shadow-md hover:scale-105 transition-transform duration-200"
          >
            <User size={48} />
            <span className="text-base font-semibold capitalize">{role}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectRole;
