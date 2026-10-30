import { Conversation } from '@/types/chat';
import {
  ExportFormatV1,
  ExportFormatV2,
  ExportFormatV3,
  ExportFormatV4,
  LatestExportFormat,
  SupportedExportFormats,
} from '@/types/export';
import { FolderInterface } from '@/types/folder';
import { Prompt } from '@/types/prompt';

import { cleanConversationHistory } from './clean';

export function isExportFormatV1(obj: any): obj is ExportFormatV1 {
  return Array.isArray(obj);
}

export function isExportFormatV2(obj: any): obj is ExportFormatV2 {
  return !('version' in obj) && 'folders' in obj && 'history' in obj;
}

export function isExportFormatV3(obj: any): obj is ExportFormatV3 {
  return obj.version === 3;
}

export function isExportFormatV4(obj: any): obj is ExportFormatV4 {
  return obj.version === 4;
}

export const isLatestExportFormat = isExportFormatV4;

export function cleanData(data: SupportedExportFormats): LatestExportFormat {
  if (isExportFormatV1(data)) {
    return {
      version: 4,
      history: cleanConversationHistory(data),
      folders: [],
      prompts: [],
    };
  }

  if (isExportFormatV2(data)) {
    return {
      version: 4,
      history: cleanConversationHistory(data.history || []),
      folders: (data.folders || []).map((chatFolder) => ({
        id: chatFolder.id.toString(),
        name: chatFolder.name,
        type: 'chat',
      })),
      prompts: [],
    };
  }

  if (isExportFormatV3(data)) {
    return { ...data, version: 4, prompts: [] };
  }

  if (isExportFormatV4(data)) {
    return data;
  }

  throw new Error('Unsupported data format');
}

function currentDate() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

export const exportData = (filename?: string) => {
  let history = localStorage.getItem('conversationHistory');
  let folders = localStorage.getItem('folders');
  let prompts = localStorage.getItem('prompts');

  if (history) {
    history = JSON.parse(history);
  }

  if (folders) {
    folders = JSON.parse(folders);
  }

  if (prompts) {
    prompts = JSON.parse(prompts);
  }

  const data = {
    version: 4,
    history: history || [],
    folders: folders || [],
    prompts: prompts || [],
  } as LatestExportFormat;

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename ?? `conversation_history_${currentDate()}.json`;
  link.href = url;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Accepts any export format, plus legacy raw localStorage dumps (values stored as JSON strings).
export const parseImportFile = (text: string): SupportedExportFormats => {
  const data = JSON.parse(text);
  if (!data || typeof data !== 'object' || !('conversationHistory' in data)) {
    return data;
  }
  const parse = (value: unknown) =>
    typeof value === 'string' ? JSON.parse(value) : value ?? [];
  return {
    version: 4,
    history: parse(data.conversationHistory),
    folders: parse(data.folders),
    prompts: parse(data.prompts),
  } as LatestExportFormat;
};

/**
 * Helper function to deduplicate an array of objects by their `id` property in O(N) time.
 * Replaces O(N^2) `.filter((item, index, self) => index === self.findIndex(...))` logic.
 */
const deduplicateById = <T extends { id: any }>(items: T[]): T[] => {
  const seenIds = new Set();
  return items.filter((item) => {
    if (seenIds.has(item.id)) {
      return false;
    }
    seenIds.add(item.id);
    return true;
  });
};

export const importData = (
  data: SupportedExportFormats,
): LatestExportFormat => {
  const { history, folders, prompts } = cleanData(data);

  const oldConversations = localStorage.getItem('conversationHistory');
  const oldConversationsParsed = oldConversations
    ? JSON.parse(oldConversations)
    : [];

  // Performance optimization: Deduplicate array in O(N) time using a Set instead of O(N^2) findIndex
  const newHistory: Conversation[] = deduplicateById([
    ...oldConversationsParsed,
    ...history,
  ]);

  console.log('importData triggered');

  localStorage.setItem('conversationHistory', JSON.stringify(newHistory));
  if (newHistory.length > 0) {
    localStorage.setItem(
      'selectedConversation',
      JSON.stringify(newHistory[newHistory.length - 1]),
    );
  } else {
    localStorage.removeItem('selectedConversation');
  }

  const oldFolders = localStorage.getItem('folders');
  const oldFoldersParsed = oldFolders ? JSON.parse(oldFolders) : [];
  // Performance optimization: Deduplicate array in O(N) time using a Set instead of O(N^2) findIndex
  const newFolders: FolderInterface[] = deduplicateById([
    ...oldFoldersParsed,
    ...folders,
  ]);
  localStorage.setItem('folders', JSON.stringify(newFolders));

  const oldPrompts = localStorage.getItem('prompts');
  const oldPromptsParsed = oldPrompts ? JSON.parse(oldPrompts) : [];
  // Performance optimization: Deduplicate array in O(N) time using a Set instead of O(N^2) findIndex
  const newPrompts: Prompt[] = deduplicateById([...oldPromptsParsed, ...prompts]);
  localStorage.setItem('prompts', JSON.stringify(newPrompts));

  return {
    version: 4,
    history: newHistory,
    folders: newFolders,
    prompts: newPrompts,
  };
};
