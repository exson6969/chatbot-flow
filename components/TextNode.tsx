import { MessageCircleMore } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Handle, Position } from 'reactflow';

// This component defines the appearance and behavior of a custom text node.
const TextNode = ({ data }: { data: { label: string } }) => {
  return (
    <div className="shadow-2xl rounded-md bg-white  w-80">
     <div className="flex items-center justify-between p-2 rounded-t-sm bg-teal-200 border-b border-stone-300">
        
        {/* Left side of the header*/}
        <div className="flex items-center gap-2">
          <MessageCircleMore size={14} className="text-gray-600" />
          <div className="font-semibold text-sm text-gray-800">Send Message</div>
        </div>

        {/* Right side of the header */}
        <div className="flex items-center">
          <Image
            src="/WhatsApp.png"
            alt="WhatsApp"
            width={16}
            height={16}
            className="object-contain"
          />
        </div>
      </div>
      <div className="text-xs mt-1 px-4 py-2 ">{data.label}</div>
      {/* 
        Handle components define connection points for edges.
        type="target": This handle can be the target of a connection.
        type="source": This handle can be the source of a connection.
        position: The side of the node where the handle is placed.
      */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 bg-teal-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 bg-teal-500"
      />
    </div>
  );
};

export default TextNode;