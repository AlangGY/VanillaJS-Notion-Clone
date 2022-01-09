export default function ContentNav({ $target, initialState, onGetDocument }) {
  // DOM Create
  const $nav = document.createElement('nav');
  $nav.className = 'content-page__nav';
  $target.appendChild($nav);

  // State, setState
  //    State : selectedDocument {id:Number, title:String, content:String ,  documents:Array}
  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;

    this.render();
  };

  // Render
  this.render = () => {
    const { documents } = this.state;
    $nav.innerHTML = `
        <header>하위 Documents</header>
        <content>${documents
          .map(
            (document) =>
              `
              <button class="content-page__nav__document link" data-id="${document.id}">
                ${document.title}
              </button>`
          )
          .join('<span class=\'divider\'>/</span>')}
        </content>`;
  };
  // EventHandler
  $nav.addEventListener('click', (e) => {
    const { target } = e;
    if (target.className === 'content-page__nav__document link') {
      const { id } = target.dataset;
      onGetDocument(id);
    }
  });

  // Functions
}
