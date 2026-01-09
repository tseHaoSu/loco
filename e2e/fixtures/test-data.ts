/**
 * Test data generators and helpers
 */

export function generateUniqueId(): string {
  return `test_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export function generateTestConversationId(): string {
  return `conv_${generateUniqueId()}`;
}

export function generateTestFileName(extension = 'txt'): string {
  return `test-file-${generateUniqueId()}.${extension}`;
}

export interface TestFileMetadata {
  name: string;
  category: string;
  size?: number;
  type?: string;
}

export function generateTestFile(category: string, extension = 'txt'): TestFileMetadata {
  return {
    name: generateTestFileName(extension),
    category,
    size: Math.floor(Math.random() * 10000) + 1000,
    type: extension,
  };
}

export const TEST_CATEGORIES = [
  'Documentation',
  'FAQ',
  'Technical',
  'Policy',
  'Training',
];

export const TEST_MESSAGES = [
  'Hello, I need help with my account',
  'Can you assist me with this issue?',
  'I have a question about billing',
  'How do I reset my password?',
  'I\'m having trouble logging in',
];

export const TEST_FILE_PATHS = {
  txt: 'e2e/fixtures/files/test-document.txt',
  pdf: 'e2e/fixtures/files/test-document.pdf',
  docx: 'e2e/fixtures/files/test-document.docx',
};

export const TEST_DATA_TAG = '__e2e_test__';

export function tagTestData(name: string): string {
  return `${TEST_DATA_TAG}_${name}`;
}

export function isTestData(name: string): boolean {
  return name.startsWith(TEST_DATA_TAG);
}
