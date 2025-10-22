import { Node, Edge } from 'reactflow';

export interface NodeData {
  label: string;
}

export type CustomNode = Node<NodeData>;
export type CustomEdge = Edge;