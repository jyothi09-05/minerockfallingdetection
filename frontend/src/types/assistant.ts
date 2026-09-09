export interface ToolCall {
  name: string;
  arguments: Record<string, any>;
  result: Record<string, any>;
}

export interface Citation {
  citation_id: string;
  doc_id: string;
  title: string;
  category: string;
  relevance_score: number;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  role_type?: string;
  tool_calls?: ToolCall[];
  citations?: Citation[];
  provider?: string;
}

export interface AssistantRoleConfig {
  title: string;
  description: string;
  system_prompt: string;
  suggested_questions: string[];
}

export interface KnowledgeBaseStatus {
  is_indexed: boolean;
  total_chunks: number;
  categories: string[];
  storage_mode: string;
  embedding_dimensions: number;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface MiningReport {
  report_id: string;
  report_type: string;
  title: string;
  created_at: string;
  markdown_content: string;
  raw_data?: Record<string, any>;
}
