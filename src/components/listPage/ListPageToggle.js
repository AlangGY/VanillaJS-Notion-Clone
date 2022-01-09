export default function ListPageToggle({ $target, initialState }) {
  // DOM Create
  const $toggleBar = document.createElement('div');
  $toggleBar.className = 'list-page__toggle-bar';
  $target.appendChild($toggleBar);
  // state , setState
  // state : istoggled : boolean
  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };
  // Render

  this.render = () => {
    const isToggled = this.state;
    $toggleBar.innerHTML = `
        <header class="list-page__title">AlangNote</header>
        <button class="list-page__toggle-bar__button">${
          isToggled ? '>>' : '<<'
        }</button>
        `;
  };

  // Event Listener

  $toggleBar.addEventListener('click', (e) => {
    const { target } = e;
    const { className } = target;
    if (className === 'list-page__toggle-bar__button') {
      this.setState(!this.state);
      const isToggled = this.state;
      $target.style.marginLeft = isToggled ? '-250px' : '0px';
    }
  });

  this.render();
}
