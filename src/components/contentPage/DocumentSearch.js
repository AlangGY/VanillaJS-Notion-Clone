export default function DocumentSearch({
  $target,
  initialState,
  onMakeDocumentLink
}) {
  // DOM Create
  const $searchForm = document.createElement('form');
  $searchForm.className = 'document-search__form';

  // state, setState
  // state : flattedDocuments {}
  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;

    this.render();
  };

  // Render

  this.render = () => {
    $target.appendChild($searchForm);
    const { selectedDocument, flattedDocuments } = this.state;
    let flattedDocumentsEntries = Object.entries(flattedDocuments);
    const { id: selectedId } = selectedDocument;
    $searchForm.innerHTML = `
        <input list="documents-list" class="document-search__input" placeholder="Link Document" />
        <datalist id="documents-list">
            ${flattedDocumentsEntries
              .map(([id, title]) =>
                selectedId !== parseInt(id)
                  ? `<option data-id=${id} value="${title}"/>`
                  : ''
              )
              .join('')}
        </datalist>
        
        `;
    $searchForm.querySelector('input').focus();
  };
  this.render();

  // Event Listener
  $searchForm.addEventListener('submit', (e) => {
    try {
      e.preventDefault();
      const { target } = e;
      const searchTitle = e.target.querySelector('input').value;
      const $option = target.querySelector(`[value="${searchTitle}"]`);
      const { id } = $option.dataset;
      onMakeDocumentLink(id, searchTitle);
    } catch (e) {
      console.error(e);
    }
  });

  // Document Update 방지
  $searchForm.addEventListener('keyup', (e) => {
    e.stopPropagation();
  });
  // FocusOut 시 SearchForm 삭제
  $searchForm.addEventListener('focusout', () => {
    setTimeout(() => {
      try {
        $target.removeChild($searchForm);
      } catch (e) {
        console.error(e);
      }
    }, 0);
  });
}
