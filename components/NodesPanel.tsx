import { MessageCircleMore } from 'lucide-react';
import React from 'react';

// Define the available nodes. To add a new node, you just need to add a new object to this array.
const availableNodes = [
  {
    type: 'textNode',
    label: 'Message',
    icon: <MessageCircleMore size={20} />,
  },
];

const NodesPanel = () => {
  // This function sets the data to be transferred during a drag-and-drop operation.
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="grid grid-cols-2 gap-4">
        {availableNodes.map((node) => (
          <div
            key={node.type}
            className="flex flex-col items-center justify-center text-blue-600 gap-2 p-4 border-2 border-gray-300 rounded-lg cursor-grab text-center bg-white hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
            onDragStart={(event) => onDragStart(event, node.type)}
            draggable
          >
            {node.icon}
            <span className="text-sm font-medium ">{node.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default NodesPanel;