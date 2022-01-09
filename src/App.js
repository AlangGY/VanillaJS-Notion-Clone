import api from './api.js';
import ContentPage from './components/ContentPage/ContentPage.js';
import ListPage from './components/ListPage/ListPage.js';
import { LOCAL_STORAGE_KEY } from './util/constants.js';
import { debounce } from './util/debounce.js';
import {
  makeRouter,
  push,
  replaceHistory,
  routeName
} from './routes/router.js';
import { setItem } from './util/storage.js';

export default function App({ $target, initialState }) {
  // State , setState
  //  State : {documents:Array, flattedDocuments:Array, selectedDocument:{...}, toggledDocuments:{} , favoriteDocuments:{} }
  this.state = initialState;

  this.setState = (nextState, sendState = true) => {
    this.state = nextState;
    if (sendState) {
      listPage.setState(this.state);
      if (this.state.selectedDocument.id) {
        contentPage.setState(this.state);
      }
    }
  };
  // Components
  const listPage = new ListPage({
    $target,
    initialState,
    onGetDocument: async (id) => {
      await getDocument(id);
    },
    onCreateDocument: async (parent = null) => {
      await createDocument(parent);
    },
    onToggleDocument: (id, isOn) => {
      toggleDocument(id, isOn);
    }
  });

  const contentPage = new ContentPage({
    $target,
    initialState,
    onUpdateDocument: async ({ id, title, content }, isRender = true) => {
      // ListPage Title 낙관적 업데이트
      document
        .querySelectorAll(`li[data-id="${this.state.selectedDocument.id}"`)
        .forEach((node) => {
          node.querySelector('span').textContent = title;
        });
      // Update If Favorite
      if (this.state.favoriteDocuments[id]) {
        updateFavoriteTitle(id, title, false);
      }
      // DeBounce
      debounce(() => updateDocument(id, title, content, isRender), 1000)();
    },
    onDeleteDocument: async (documentId, isLast) => {
      const { favoriteDocuments, toggledDocuments } = this.state;
      if (favoriteDocuments[documentId]) {
        toggleFavorite(documentId, false);
      }
      if (toggledDocuments[documentId]) {
        toggleDocument(documentId, false, false);
      }
      await deleteDocument(documentId, false);
      if (isLast) {
        await getRootDocuments();
        replaceHistory('/');
      }
    },
    onGetDocument: async (id) => {
      await getDocument(id);
    },
    onToggleFavorite: (id) => {
      toggleFavorite(id);
    }
  });

  // Functions
  const getRootDocuments = async (sendState = true) => {
    const documents = await api.getRootDocuments();
    this.setState({ ...this.state, documents }, sendState);
  };
  const getDocument = async (id, sendState = true) => {
    const selectedDocument = await api.getDocumentContentById(id);
    if (!selectedDocument) {
      this.setState({ ...this.state, selectedDocument: {} }, sendState);
      replaceHistory('/');
      return;
    }
    this.setState({ ...this.state, selectedDocument }, sendState);
    push(`/${routeName.document}/${id}`);
  };
  const getDocumentWithReplace = async (id, sendState = true) => {
    const selectedDocument = await api.getDocumentContentById(id);
    if (!selectedDocument) {
      this.setState({ ...this.state, selectedDocument: {} }, sendState);
      replaceHistory('/');
      return;
    }
    this.setState({ ...this.state, selectedDocument }, sendState);
    replaceHistory(`/${routeName.document}/${id}`);
  };
  const createDocument = async (parent, sendState = true) => {
    try {
      const $newDocument = await api.createDocument({
        title: '새로운 Document',
        parent
      });
      const { id } = $newDocument;
      this.setState(
        {
          ...this.state,
          flattedDocuments: {
            ...this.state.flattedDocuments,
            [id]: '새로운 Document'
          }
        },
        false
      );
      await getRootDocuments(false);
      await getDocument(id, sendState);
    } catch (e) {
      console.log(e);
    }
  };
  const updateDocument = async (id, title, content, sendState = true) => {
    await api.updateDocumentContentById(id, { title, content });
    const documents = await api.getRootDocuments();
    const { flattedDocuments } = this.state;
    delete flattedDocuments[id];
    flattedDocuments[id] = title;
    this.setState(
      {
        ...this.state,
        documents,
        selectedDocument: {
          ...this.state.selectedDocument,
          title,
          content
        },
        flattedDocuments
      },
      sendState
    );
  };
  const deleteDocument = async (documentId, sendState = true) => {
    try {
      await api.deleteDocumentById(documentId);
      const { flattedDocuments } = this.state;
      delete flattedDocuments[documentId];
      this.setState({ ...this.state, flattedDocuments }, sendState);
    } catch (e) {
      console.log(e);
    }
  };
  const flatRootDocuments = (documents, sendState = true) => {
    const flattedDocuments = {};
    recursive(documents);

    function recursive(documents) {
      documents.forEach(({ title, id, documents: underDocuments }) => {
        flattedDocuments[id] = title;
        if (documents.length > 0) recursive(underDocuments);
      });
    }
    this.setState({ ...this.state, flattedDocuments }, sendState);
  };
  const updateFavoriteTitle = (id, title, sendState = true) => {
    const { favoriteDocuments } = this.state;
    if (favoriteDocuments[id]) {
      favoriteDocuments[id] = title;
    }
    this.setState({ ...this.state, favoriteDocuments }, sendState);
    setItem(LOCAL_STORAGE_KEY.FAVORITE_DOCUMENTS, favoriteDocuments);
  };
  const toggleFavorite = (id, sendState = true) => {
    const { selectedDocument, favoriteDocuments } = this.state;
    const { title } = selectedDocument;
    favoriteDocuments[id]
      ? delete favoriteDocuments[id]
      : (favoriteDocuments[id] = title);
    this.setState({ ...this.state, favoriteDocuments }, sendState);
    setItem(LOCAL_STORAGE_KEY.FAVORITE_DOCUMENTS, favoriteDocuments);
  };
  const toggleDocument = (id, isOn, sendState = true) => {
    const { toggledDocuments } = this.state;
    isOn ? (toggledDocuments[id] = true) : delete toggledDocuments[id];
    this.setState({ ...this.state, toggledDocuments }, sendState);
    setItem(LOCAL_STORAGE_KEY.TOGGLED_DOCUMENTS, toggledDocuments);
  };

  // Routing
  this.route = () => {
    $target.innerHTML = '';
    const { pathname } = window.location;
    const [, , documentId] = pathname.split('/');
    switch (pathname.split('/')[1]) {
      case routeName.home:
        if (!this.state.selectedDocument.id) this.setState(this.state);
        listPage.render();
        break;
      case routeName.document:
        if (this.state.selectedDocument.id !== parseInt(documentId)) {
          getDocumentWithReplace(documentId);
          break;
        }
        listPage.render();
        contentPage.render();
        break;
    }
  };

  // Init
  this.init = async () => {
    await getRootDocuments(false);
    flatRootDocuments(this.state.documents, false);
    this.route();
    makeRouter(() => this.route());
  };

  this.init();
}
