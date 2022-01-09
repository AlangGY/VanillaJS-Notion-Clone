import { getItem, setItem } from './storage.js';

const API_END_POINT = 'https://kdt.roto.codes';
const ROUTE = '/documents';
export let USER_NAME = getUserName();

function getUserName() {
  let userName = getItem('user-name', '');
  userName =
    userName === ''
      ? window.prompt(
          '유저 명을 입력해주세요(띄어쓰기 없이 영문,숫자, 기호(-)만 가능합니다)'
        )
      : userName;
  if (userName.match(/[^A-Z0-9-]/gi)) {
    getUserName();
    return;
  }
  setItem('user-name', userName);
  return userName;
}

const api = {
  // Root Documents 가져오기
  getRootDocuments: async () => {
    const rootDocuments = await request(ROUTE);
    return rootDocuments;
  },
  // 특정 Document의 content 조회하기
  getDocumentContentById: async (documentId) => {
    const document = await request(`${ROUTE}/${documentId}`);
    return document;
  },
  // Document 생성하기
  createDocument: async ({ title, parent = null }) => {
    const body = JSON.stringify({ title, parent });
    const createdDocument = await request(`${ROUTE}`, {
      method: 'POST',
      body
    });
    return createdDocument;
  },
  // 특정 Document 수정하기
  updateDocumentContentById: async (documentId, { title, content }) => {
    const body = JSON.stringify({ title, content });
    const updatedDocument = await request(`${ROUTE}/${documentId}`, {
      method: 'PUT',
      body
    });
    return updatedDocument;
  },
  // 특정 Document 삭제하기
  deleteDocumentById: async (documentId) => {
    return await request(`${ROUTE}/${documentId}`, {
      method: 'DELETE'
    });
  }
};

const request = async (url, options = {}) => {
  try {
    const res = await fetch(`${API_END_POINT}${url}`, {
      ...options,
      headers: { 'x-username': USER_NAME, 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    throw Error(e);
  }
};

export default api;
