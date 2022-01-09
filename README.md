## 📌 프로젝트 설명

노션과 같은 편집기 웹사이트 구현

## 👩‍💻 요구 사항과 구현 내용

### 배포 페이지 (모바일에선 원활히 작동하지 않습니다)

[배포 링크](https://w4-project-notion-vanilla-js.vercel.app/)

### 😡 현재 api 서버가 내려감으로 인해 정상적인 작동이 되지 않습니다.

### 하위 도큐먼트 생성 및 삭제

![하위 도쿠먼트 생성](https://user-images.githubusercontent.com/75013334/132015241-e46cd31b-70b1-456f-92df-5258e6f0f142.gif)

### 문서 자동저장 및 SideBar 제목 반영의 낙관적 업데이트

![제목 낙관적 업데이트](https://user-images.githubusercontent.com/75013334/132015292-f187262b-62cd-4216-886f-361c5237703c.gif)

### 즐겨찾기 기능

![Favorite](https://user-images.githubusercontent.com/75013334/132015373-e0fb370e-193b-4caf-9998-df189863bb2e.gif)

### 도큐먼트 트리 및 SIdeBar 숨김 기능

![부가적 기능](https://user-images.githubusercontent.com/75013334/132015496-1a332de1-194e-402c-a6f8-c0b4210ba39e.gif)

### Editor Content h1, h2, h3 기능

![에디터 헤더](https://user-images.githubusercontent.com/75013334/132015551-924f8ab0-5d1d-4d17-817e-d34e4da5228e.gif)

### Editor내 문서 링크 기능

![링크 달기](https://user-images.githubusercontent.com/75013334/132015593-39b7c371-f6ba-4108-8771-b385330c39cb.gif)

## 컴포넌트 트리

- Main

  - App

    - ListPage

      - ListPageToggle
      - FavoritesList
      - DocumentsList

    - ContentPage
      - ContentSettings
      - Editor
        - DocumentSearch
      - ContentNav

- 기능 구현

  - [x] Document List에서 Document 클릭시 Content 렌더링
  - [x] 선택한 Document 하위 Document 있을경우 트리 형태로 아래 목록 렌더링
    - [x] 모든 하위 Document 렌더링
    - [x] 선택했을때만 Document 렌더링
  - [x] Document 생성하고 편집화면으로 넘김
  - [x] 기록할때마다 자동 저장
  - [x] 제목 수정시 ListPage도 state변경, 반영
  - [x] div , contentEditable을 통해 다양한 기능의 에디터 만들기
    - [x] h1, h2, h3 태그 만들기
    - [x] / 로 페이지 탐색 및 링크 걸기
  - [x] 편집기 내에서 하위 Document 링크 렌더링
  - [x] 편집기 내에서 다른 Document name을 적을 시 자동으로 해당 Document의 편집 페이지로 이동하는 링크 기능 추가
  - [x] document 삭제기능
  - [x] XSS 공격 방지
  - [ ] 하위 Document 옮기기 기능
  - [x] Favorite Documents
  - [ ] Login 기능
  - [x] 뒤로가기 기능
  - [ ] 하위 디렉토리가 Div 컨텐츠 내에 생성되고, 지울시에 해당 디렉토리가 삭제되는 기능

- 겪었던 문제, 솔루션

  - [x] Document를 클릭했을때, DocumentsList가 새로 렌더링되며 토글 된 Tree가 사라지는 현상. - 토글을 시켰을때, 토글된 id를 state에서 기억한다. - tree 렌더링을 실행하고, 토글된 id에 한해서 내부 Tree를 렌더링한다.
  - [x] 상위 Document를 삭제했을때, 하위 Document가 삭제 되지 않고 root Document로 이동되는 문제 - 삭제 진행시, 해당하위 document들을 순회하며 삭제요청
  - [x] 새로고침시, 선택된 Document 표시 안되는 문제 - route rendering시, 상태 값내에 selectedDocument 값이 없을경우, api호출하여 setState
  - [x] 커서 올릴때, 하위 문서의 버튼도 보이게 되는 문제 (CSS) - 하위 도큐먼트를 ul 내부에 렌더링하지않고, 외부에 형제로 렌더링하여 분리
  - [x] 하위나 상위 Component가 아닌 형제 Component에게 바뀐 상태값을 반영할때 일일이 로직을 짜야하는 번거로움 - State관리를 모두(ToggledDocuments 제외) App.js의 state에서 모아 관리하는 방식으로 변경. App의 setState를 진행할경우 하위 컴포넌트에게 모두 상태값을 전달한다.
  - [x] Toggled된 Documents 삭제시 LocalStorage에 dummy-data 쌓이는 문제
  - [x] Favorite 된 Documents 삭제시 localStorage에 dummy-data 쌓이는 문제 - Documents 삭제시 LocalStorage내 ToggledDocuments와 FavoriteDocuments에 해당 id확인후 있을경우 삭제.
  - [x] 제목을 작성후 바로 코멘트로 이동해 작성할경우, Title 상태변경이 안되는문제 - QuerySelector(li[data-id=${id}]) 를 이용한 DocumentList의 낙관적 업데이트 적용.
    - [x] 하위 도큐먼트들을 Hover시, ul의 padding-left로 인해 background-color가 전부 적용되지않고 빈칸이 생기는 문제 - Rendering Document Tree 순회중 Depth에 따라 내부 div에 padding-left = ${depth \* 20}px 과 같은 형태로 css style 적용

- 리팩토링 과제
  - api가 작동되지 않을때, 에러핸들링 및 local에서도 동작하도록 기능 구현
