import ContentNav from './ContentNav.js';
import ContentSettings from './ContentSettings.js';
import Editor from './Editor.js';

export default function ContentPage({
  $target,
  initialState,
  onUpdateDocument,
  onDeleteDocument,
  onGetDocument,
  onToggleFavorite
}) {
  const $page = document.createElement('div');
  $page.className = 'content-page';
  // State , setState
  //  State : {documents:Array,flattedDocuments:Array, selectedDocument:{...}, toggledDocuments:{} , favoriteDocuments:{} }
  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    const { selectedDocument, favoriteDocuments, flattedDocuments } =
      this.state;
    if (selectedDocument.id) {
      contentNav.setState(selectedDocument);
      editor.setState({ selectedDocument, flattedDocuments });
      settings.setState({ selectedDocument, favoriteDocuments });
    }
  };

  // Component

  const settings = new ContentSettings({
    $target: $page,
    initialState: {
      selectedDocument: this.state.selectedDocument,
      flattedDocuments: this.state.flattedDocuments
    },
    onDeleteDocument,
    onToggleFavorite
  });

  const editor = new Editor({
    $target: $page,
    initialState: {
      selectedDocument: this.state.selectedDocument,
      flattedDocuments: this.state.flattedDocuments
    },
    onUpdateDocument,
    onGetDocument
  });
  const contentNav = new ContentNav({
    $target: $page,
    initialState: this.state.selectedDocument,
    onGetDocument,
    onToggleFavorite
  });

  // Render

  this.render = () => {
    $target.appendChild($page);
  };
}
