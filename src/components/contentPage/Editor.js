import { filterTag } from '../../util/scriptFilter.js';
import DocumentSearch from './DocumentSearch.js';

export default function Editor({
  $target,
  initialState,
  onUpdateDocument,
  onGetDocument
}) {
  // Function Variables
  let isInit = false;
  let selectionOffsets = null;
  // DOM Create
  const $editor = document.createElement('div');
  $editor.className = 'content-page__editor';
  $target.appendChild($editor);

  // State , setState
  // state : {selectedDocument,flattedDocuments}
  this.state = initialState;

  this.setState = (nextState, isRender = true) => {
    this.state = nextState;
    if (isRender) {
      this.render();
    }
  };

  // Render
  this.render = () => {
    const { content, title } = this.state.selectedDocument;
    if (!isInit) {
      $editor.innerHTML = `
          <input type="text" name="title" placeholder="Untitled" value="${title}" />
          <div contenteditable name="content" placeholder="내용을 입력하세요" >${content}</div>
          `;
      isInit = true;
    }
    $editor.querySelector('[name=title]').value = title;
    $editor.querySelector('[name=content]').innerHTML = content;
    loadSelectionOffsets();
  };

  // Event Handler

  //     Key up
  $editor.addEventListener('keyup', (e) => {
    const $text = e.target.closest('[name]');
    const { selectedDocument } = this.state;
    const { anchorNode, anchorOffset } = window.getSelection();
    saveSelectionOffsets(anchorNode, anchorOffset);
    selectionOffsets = null;
    if ($text) {
      const key = $text.getAttribute('name');
      const { innerHTML } = $text;
      switch (key) {
        case 'title':
          selectedDocument[key] = filterTag($text.value); // XSS 방지
          onUpdateDocument(selectedDocument, false);
          if (e.key === 'Enter') {
            $editor.querySelector('[name=content]').focus();
          }
          break;
        case 'content':
          if (editorShortcutKeyInput(e.key, anchorNode)) return;
          selectedDocument[key] = innerHTML;
          onUpdateDocument(selectedDocument, false);
          break;
      }
      this.setState({ ...this.state, selectedDocument }, false);
    }
  });

  // Click
  $editor.addEventListener('click', async (e) => {
    const { target } = e;
    const { className } = target;
    if (className === 'document-link') {
      const { id } = target.dataset;
      await onGetDocument(id);
    }
  });

  // function

  const editorShortcutKeyInput = (key, node) => {
    switch (key) {
      case ' ':
        makeHeader(node.parentNode, node.textContent);
        return true;
      case '/':
        searchDocument(node.parentNode, node.textContent);
        return true;
      default:
        return;
    }
  };

  const makeHeader = (node, text) => {
    const parentNode = $editor.querySelector('[name=content]');
    let $header;
    if (
      text.indexOf('####') === 0 ||
      !text.startsWith('#') ||
      text.match(/[^#\s]/g)
    ) {
      return;
    } else if (text.indexOf('###') === 0) {
      $header = document.createElement('h3');
      $header.innerText = text.substring(4);
    } else if (text.indexOf('##') === 0) {
      $header = document.createElement('h2');
      $header.innerText = text.substring(3);
    } else if (text.indexOf('#') === 0) {
      $header = document.createElement('h1');
      $header.innerText = text.substring(2);
    }
    $header.innerHTML = '<br>';
    if (node.parentNode === parentNode) {
      parentNode.replaceChild($header, node);
    } else {
      parentNode.innerHTML = '';
      parentNode.appendChild($header);
    }
    window.getSelection().collapse($header, 0);
  };

  const searchDocument = (node, text) => {
    if (text.match(/[^/\s]/g)) {
      return;
    }
    if (node.getAttribute('name') === 'content') {
      const $newNode = document.createElement('div');
      node.textContent = '';
      node.appendChild($newNode);
      node = $newNode;
    }
    node.textContent = '';
    const { flattedDocuments, selectedDocument } = this.state;
    new DocumentSearch({
      $target: node,
      initialState: { flattedDocuments, selectedDocument },
      onMakeDocumentLink: (id, title) => {
        node.innerHTML = `
        <button data-id="${id}" class="document-link" contenteditable="false">   
          ${title}<br>
        </button>
        `;
        const parentNode = node.parentNode;
        const $link = node.querySelector('button');
        const $nextLine = document.createElement('div');
        parentNode.replaceChild($link, node);
        $nextLine.innerHTML = '<br>';
        parentNode.insertBefore($nextLine, $link);
        parentNode.insertBefore($nextLine, $link.nextSibling);
        window.getSelection().collapse($nextLine, 0);

        const { selectedDocument } = this.state;
        selectedDocument.content =
          $editor.querySelector("[name='content']").innerHTML;
        this.setState({ ...this.state, selectedDocument }, false);
        onUpdateDocument(selectedDocument, false);
      }
    });
  };

  const saveSelectionOffsets = (node, offset) => {
    selectionOffsets = { node, offset };
  };
  const loadSelectionOffsets = () => {
    if (selectionOffsets) {
      const { node, offset } = selectionOffsets;
      window.getSelection().collapse(node, offset);
      selectionOffsets = null;
    }
  };
}
