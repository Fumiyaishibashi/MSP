import { useNavigate } from 'react-router-dom';
import type { EventProject } from '../../types';
import { MapPin, Calendar } from 'lucide-react';

interface EventStickyCardProps {
  project: EventProject;
}

const EventStickyCard: React.FC<EventStickyCardProps> = ({ project }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/event/${project.id}`);
  };

  const statusColors: Record<EventProject['status'], string> = {
    '募集中': 'bg-green-100 text-green-800 border-green-300',
    '企画中': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    '準備中': 'bg-blue-100 text-blue-800 border-blue-300',
    '終了': 'bg-gray-100 text-gray-800 border-gray-300',
  };

  return (
    <div
      onClick={handleClick}
      className="relative bg-white border-l-8 border-blue-500 rounded-lg p-6 shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 cursor-pointer group"
    >
      <div className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded-full border ${statusColors[project.status]}`}>
        {project.status}
      </div>

      <h3 className="text-xl font-bold text-blue-900 mb-3 truncate group-hover:text-blue-700 pr-16">
        {project.title}
      </h3>
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-blue-500" />
          <span>{project.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-blue-500" />
          <span>{project.date}</span>
        </div>
      </div>
    </div>
  );
};

export default EventStickyCard;
