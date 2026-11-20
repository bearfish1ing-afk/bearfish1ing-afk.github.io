# 배은주 포트폴리오 (GitHub Pages)

```
index.html            ← 건드릴 필요 없음
data/portfolio.js     ← ✏️ 내용은 전부 여기서 수정
assets/render.js      ← 데이터 → 화면 규칙 (건드릴 필요 없음)
assets/style.css      ← 색·글꼴은 맨 위 :root 만 수정
assets/app.js         ← 스크롤 효과 (건드릴 필요 없음)
```

## 배포 (github.io)

1. GitHub에 **`아이디.github.io`** 이름으로 저장소를 만듭니다.
2. 이 폴더의 파일을 그대로 올립니다 (`index.html`이 저장소 맨 위에 있어야 함).
3. Settings → Pages → Source: `Deploy from a branch`, Branch: `main` / `(root)` → Save
4. 1~2분 뒤 `https://아이디.github.io` 에서 확인합니다.

> 로컬에서는 `index.html`을 더블클릭해도 바로 열립니다 (서버 필요 없음).

---

## 편집 규칙

### 규칙 1. 빈 값은 숨겨진다
`""`(빈 문자열)이나 `"{입력}"` 같은 자리표시는 화면에 나오지 않습니다.
```js
github: "",                                  // 숨김
github: "https://github.com/bearfish1ing-afk", // 표시 + 연락처 카드 생성
```

### 규칙 2. 배열 = 화면 순서
`projects`, `skills`, `history` 등에서 항목 순서를 바꾸면 화면 순서도 바뀝니다. 지우면 사라지고, 복사해서 붙이면 하나 더 생깁니다.

### 규칙 3. 텍스트 꾸미기
| 쓰는 법 | 결과 |
|---|---|
| `**굵게**` | **굵게** |
| `` `코드` `` | `코드` 글씨 |

### 규칙 4. 상세 내용은 블록으로 쌓는다
프로젝트·교육의 `blocks` 배열에 아래 5가지 블록을 원하는 순서로 넣습니다.

| type | 모양 | 형식 |
|---|---|---|
| `list` | 점 목록 | `{ type: "list", title: "나의 역할", items: ["...", "..."] }` |
| `steps` | 번호 카드 | `{ type: "steps", title: "동작 흐름", items: ["...", "..."] }` |
| `table` | 표 | `{ type: "table", title: "기술 선택 이유", head: ["선택","대안","이유"], rows: [["a","b","c"]] }` |
| `trouble` | 트러블슈팅 카드 | `{ type: "trouble", title: "트러블슈팅", items: [{ title: "...", steps: [["증상","..."],["원인","..."],["해결","..."]] }] }` |
| `quote` | 강조 문장 | `{ type: "quote", title: "배운 점", items: ["..."] }` |

프로젝트 카드에서 `title`이 **"나의 역할"**인 블록은 카드 오른쪽에 바로 보이고, 나머지 블록은 "상세 내용 보기"를 눌러야 펼쳐집니다.

`trouble`의 라벨 색은 자동입니다: **해결**이 들어가면 보라, **원인/재발**이 들어가면 주황, 나머지는 흰색.

### 규칙 5. 프로젝트 하나 추가하기
`projects` 배열의 아무 항목을 통째로 복사해 붙이고 아래만 바꾸면 됩니다.

```js
{
  id: "newproject",          // 영문, 겹치지 않게 (주소 #project-newproject)
  title: "새 프로젝트",
  subtitle: "한 줄 설명",
  icon: "orb",               // orb | ring | cube | drop
  badge: "",                 // 카드 오른쪽 위 배지 (ex. "대상 수상")
  meta: [["기간","2027.01 – 2027.02"], ["인원","3명"]],
  summary: "카드와 상세 맨 위에 보이는 소개",
  pain: "왼쪽 보라 패널의 Problem",
  need: "왼쪽 보라 패널의 Solution",
  stack: ["Java", "Spring Boot"],
  blocks: [ /* 규칙 4 */ ],
  links: [{ label: "GitHub", url: "https://..." }],   // url 이 비면 회색 칩으로 표시
},
```

### 규칙 6. 섹션 순서와 메뉴
`sections` 배열 순서대로 섹션이 나오고 메뉴도 그 순서로 만들어집니다. 줄을 위아래로 옮기면 순서가 바뀌고, 지우면 섹션이 사라집니다. `nav`를 비우면 섹션은 보이지만 메뉴에서만 빠집니다. 섹션 배경은 흰색/연보라가 자동으로 번갈아 나옵니다.

### 규칙 7. 자격증 · 대외활동 · 수상
세 섹션은 같은 형식입니다: `{ tag, title, org, date, notes: [] }`. 항목을 복사해 붙이면 하나 더 생깁니다.
새 섹션(예: `projects2`, `languages`)을 만들고 싶으면 같은 형식의 배열을 추가하고 `sections`에 `{ id: "그 이름", ... }`을 넣으면 됩니다.

### 규칙 8. 교육이수
`{ title, org, period, rows: [[라벨, 내용]], stack, blocks, links }` 형식입니다. `rows`에는 내용·적용·수업 과제 등을 자유롭게 넣고, `blocks`가 있으면 "과제 상세 보기"로 펼쳐집니다.

### 소개 수정
`profile.info`는 About me 맨 위 아이콘 칸입니다. `[라벨, 값, 아이콘]` 형식이고, 아이콘은 `user | school | mail | github | badge | pin` 중에 고릅니다. 값이 `http`로 시작하면 링크, `@`가 있으면 메일 링크가 됩니다.
`about.text`는 문단 배열, `about.ways`는 "이런 방식으로 일합니다" 카드 배열입니다. 카드를 추가하면 그리드에 하나 더 생깁니다.

### 색 바꾸기
`assets/style.css` 맨 위 `:root`의 `--accent`(포인트 색), `--hero-a/b/c`(그라데이션 3색)만 바꾸면 전체가 따라 바뀝니다.

### 문제가 생기면
화면에 "불러오지 못했습니다"가 뜨면 `data/portfolio.js`에서 **쉼표 누락**이나 **따옴표 짝**을 확인하세요. 문장 안에 `"`를 쓰려면 `\"`로 씁니다.

## 아직 채울 곳
- `profile.department` (학과 — 소개 문장의 `{학과}` 자리에 들어감)
- `profile.github`, `profile.email`
- ShareBook `meta`의 기간
- API 변경 리포터 `links`의 "리포터 저장소·시연 영상" url
