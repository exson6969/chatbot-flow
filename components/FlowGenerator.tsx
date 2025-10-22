import React, { useState } from 'react';
import toast from 'react-hot-toast';

// Defined the props interface, which includes the state setters from the main page
interface FlowGeneratorProps {
  setNodes: (nodes: any[]) => void;
  setEdges: (edges: any[]) => void;
}

const FlowGenerator: React.FC<FlowGeneratorProps> = ({ setNodes, setEdges }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle the API call
  const handleGenerateFlow = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for the flow.');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Generating flow...');

    try {
      const response = await fetch('/api/generate-flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate flow.');
      }

      const flow = await response.json();

      // Update the main state with the generated nodes and edges
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);

      toast.success('Flow generated successfully!', { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'An unexpected error occurred.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-300">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Generate Flow with AI</h3>
      <div className="mb-4">
        <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700 mb-1">
          Describe the chatbot flow you want to create:
        </label>
        <textarea
          id="ai-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A welcome message, then ask for user's name, email and address."
          className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          disabled={isLoading}
        />
      </div>
      <button
        onClick={handleGenerateFlow}
        disabled={isLoading}
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating...' : 'Generate Flow'}
      </button>
    </div>
  );
};

export default FlowGenerator;