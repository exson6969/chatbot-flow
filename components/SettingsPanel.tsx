import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

interface SettingsPanelProps {
  selectedNode: any;
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedNode: React.Dispatch<React.SetStateAction<any>>;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  selectedNode,
  setNodes,
  setSelectedNode,
}) => {
  // State to manage the input field for the node's label.
  const [nodeLabel, setNodeLabel] = useState(selectedNode.data.label);

  // Effect to update the local state when the selected node changes.
  useEffect(() => {
    setNodeLabel(selectedNode.data.label);
  }, [selectedNode]);

  // Handler for the textarea change.
  const handleLabelChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodeLabel(event.target.value);
  };

  /**
   * Function to handle the back button click.
   * It deselects the current node, causing the main page to
   * switch back to rendering the NodesPanel.
   */
  const handleGoBack = () => {
    setSelectedNode(null);
  };

  /**
   * A helper function to get a user-friendly display name for a node type.
   * This makes the component extensible for future node types.
   * param {string} type - The internal type of the node like textNode.
   * returns {string} The display-friendly name eg 'test message 1'.
   */
  const getNodeDisplayName = (type: string): string => {
    switch (type) {
      case 'textNode':
        return 'Message';
      default:
        return 'Settings';
    }
  };

  // Function to apply the changes to the node.
  const applyChanges = () => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: nodeLabel,
            },
          };
        }
        return node;
      })
    );

    toast.success('Node updated successfully!');
  };

  return (
    <div>
      <div className="relative flex items-center justify-center p-2 border-b border-gray-300 mb-4">
        <button
          onClick={handleGoBack}
          className="absolute left-0 p-1 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Go back to nodes panel"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h3 className="text-lg font-semibold text-center text-gray-800">
          {getNodeDisplayName(selectedNode.type)}
        </h3>
      </div>

      {/* Settings Content */}
      <div className="px-2">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text
          </label>
          <textarea
            value={nodeLabel}
            onChange={handleLabelChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>
        <button
          onClick={applyChanges}
          className="w-full text-blue-600 border border-blue-600 p-2 rounded hover:bg-blue-200 transition-colors duration-200"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;