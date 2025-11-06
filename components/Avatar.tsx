
import React from 'react';

interface AvatarProps {
  name: string;
  className?: string;
}

const colors = [
  'bg-red-200 text-red-800',
  'bg-blue-200 text-blue-800',
  'bg-green-200 text-green-800',
  'bg-yellow-200 text-yellow-800',
  'bg-purple-200 text-purple-800',
  'bg-pink-200 text-pink-800',
  'bg-indigo-200 text-indigo-800',
  'bg-teal-200 text-teal-800',
];

const getAvatarColor = (name: string) => {
  const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};

const Avatar: React.FC<AvatarProps> = ({ name, className }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const colorClasses = getAvatarColor(name);

  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${colorClasses} ${className}`}
    >
      {initial}
    </div>
  );
};

export default Avatar;
