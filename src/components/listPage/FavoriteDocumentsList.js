export default function FavoriteDocumentsList({
  $target,
  initialState,
  onGetDocument
}) {
  // DOM Create
  const $favList = document.createElement('div');
  $favList.className = 'favorite-list';
  $target.appendChild($favList);

  // State, setState
  // state : favoriteDocuments: Object{ id : title }
  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  // Render
  this.render = () => {
    const favoriteDocuments = Object.entries(this.state);
    $favList.innerHTML = `
    <div class="favorite-list__header">
      <span>Favorites</span>
    </div>
      <ul class="favorite-list__ul">
        ${favoriteDocuments
          .map(
            ([id, title]) =>
              `
              <li class="favorite-list__li" data-id=${id} tabindex="0">
                <span class="favorite-list__span">${title}</span>
              </li>
              `
          )
          .join('')}
      </ul>
    `;
  };

  // Event Listener
  $favList.addEventListener('click', (e) => {
    const { target } = e;
    const $li = target.closest('li');
    if ($li) {
      const { id } = $li.dataset;
      onGetDocument(id);
    }
  });
}
