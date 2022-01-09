export default function DocumentsList({
  $target,
  initialState,
  onGetDocument,
  onCreateDocument,
  onToggleDocument
}) {
  // DOM Create
  const $documentsList = document.createElement('div');
  $documentsList.className = 'list-page__documents-list';

  $target.appendChild($documentsList);

  // State and setState
  // state : {documents:[] , selectedDocument:number, toggledDocuments:Map{}}
  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;

    this.render();
  };

  // Render
  this.render = () => {
    const { documents } = this.state;
    $documentsList.innerHTML = `
    <div class="documents-list__header">
    <span>Documents</span>
    <button class="create-document-button">📝</button>
    </div>
    `;
    $documentsList.innerHTML += makeDocumentsTree(documents);
  };

  // Functions
  const makeDocumentsTree = (documents, depth = 0) => {
    const {
      selectedDocument: { id: selectedId = null },
      toggledDocuments
    } = this.state;

    return `
    <ul class="documents-list__ul">
       ${documents
         .map(({ id, title, documents: underDocuments }) => {
           console.log(id, title);
           const isSelected = selectedId === id ? 'selected' : '';
           const renderToggleButton =
             underDocuments.length > 0
               ? `
                  <button class="documents-list__toggle${
                    toggledDocuments[id] ? ' toggled' : ''
                  }" tabindex = "0">
                    ▼	
                  </button>
                 `
               : '';

           return `
          <li data-id=${id} class="documents-list__li" tabindex = "0" >
            <div class="documents-list__document ${isSelected}"
             style="padding-left:${depth * 20}px">
              ${renderToggleButton}
              <span class="documents-list__title" >
                ${title ? title : 'Untitled'}
              </span>
              <button class="create-document-button" tabindex = "0"> 📄 </button>
            </div>
          </li>
          ${
            toggledDocuments[id] && underDocuments.length > 0
              ? makeDocumentsTree(underDocuments, depth + 1)
              : ''
          }
          `;
         })
         .join('')}
    </ul>
    `;
  };

  // EventListners
  $documentsList.addEventListener('click', async (e) => {
    const { target } = e;
    const targetClass = e.target.className;
    const $li = target.closest('li');
    if ($li) {
      const { id } = $li.dataset;
      switch (targetClass) {
        case 'documents-list__toggle toggled':
          onToggleDocument(parseInt(id), false);
          break;
        case 'documents-list__toggle':
          onToggleDocument(parseInt(id), true);
          break;
        case 'create-document-button':
          await onCreateDocument(parseInt(id));
          onToggleDocument(parseInt(id), true);
          break;
        default:
          await onGetDocument(parseInt(id));
          break;
      }
    } else {
      if (targetClass === 'create-document-button') {
        await onCreateDocument(null);
      }
    }
  });
}
