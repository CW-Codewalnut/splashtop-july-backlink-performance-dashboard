
import React from 'react';

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon, title, value, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition hover:shadow-lg">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-gray-400 text-xs">{description}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
