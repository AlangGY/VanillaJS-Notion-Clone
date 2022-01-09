export default function ContentSettings({
  $target,
  initialState,
  onDeleteDocument,
  onToggleFavorite
}) {
  const $settings = document.createElement('div');
  $settings.className = 'content-page__settings';
  $target.appendChild($settings);

  // State, setState
  //    state :  {selectedDocument {id: Number , content: String , documents:Array}, favoriteDocuments:{}}
  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;

    this.render();
  };

  this.render = () => {
    const { selectedDocument, favoriteDocuments } = this.state;
    if (selectedDocument.id) {
      const isFavorite = favoriteDocuments[selectedDocument.id];
      $settings.innerHTML = `
          <button class="content-page__settings__delete">delete this Document</button>
          <button class="content-page__settings__favorite-toggle ${
            isFavorite ? 'isFavorite' : ''
          }">
            ${isFavorite ? 'UnFavorite' : 'Favorite'}
          </button>
          `;
    }
  };

  // EventHandler
  $settings.addEventListener('click', async (e) => {
    const { target } = e;
    if (target.classList.contains('content-page__settings__delete')) {
      const { id, documents: underDocuments } = this.state.selectedDocument;
      await deleteDocuments(id, underDocuments);
    } else if (
      target.classList.contains('content-page__settings__favorite-toggle')
    ) {
      const { id } = this.state.selectedDocument;
      onToggleFavorite(id);
    }
  });

  // Function

  const deleteDocuments = async (id, underDocuments, isLast = true) => {
    if (underDocuments.length > 0) {
      await underDocuments.forEach(async (document) => {
        await deleteDocuments(document.id, document.documents, false);
      });
    }
    await onDeleteDocument(id, isLast);
  };
}
