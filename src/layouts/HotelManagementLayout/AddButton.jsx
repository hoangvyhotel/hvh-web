import { Plus } from 'lucide-react';

const AddButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="p-4 bg-gray-300 rounded hover:bg-gray-400 transition-colors">
      <Plus className="w-6 h-6 text-gray-600" />
    </button>
  );
};

export default AddButton;
