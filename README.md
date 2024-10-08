## Todo App

간편하게 일정을 관리할 수 있는 Todo 웹 서비스를 개발했습니다.
깔끔한 UI로 할 일을 쉽게 관리할 수 있고, 캘린더를 통해 날짜에 따른 할 일을 한 눈에 볼 수 있도록 구현하였습니다.

## 주요 기능

- 할 일 추가/수정/삭제
- 카테고리에 따른 일정 필터링
- 일별로 일정을 한눈에 볼 수 있는 캘린더 뷰
- 로그인/회원가입


## 메뉴얼
backend는 Spring Boot를 실행하고,
frontend는 VS Code에서 terminal에 명령어 'npm start' 하여 실행할 수 있습니다.

- 웹사이트를 처음 들어가면 로그인 페이지가 나옵니다.
로그인을 해야 서비스를 이용할 수 있으며,
회원이 아니라면 회원가입을 통해 가입하고, 성공적으로 로그인을 완료하면 이용하실 수 있습니다.

- 왼쪽에 캘린더, 오른쪽에는 할일 목록을 보여줍니다. 날짜 기본값은 '오늘' 날짜이며, 이후 캘린더에서 선택한 날짜에 따라서 할일 목록을 보여줍니다.
캘린더 하단에 Today 버튼을 통해 오늘 날짜로 이동할 수 있습니다.

- 할일이 있는 날짜에는 캘린더 일수가 파란색으로 표시됩니다.

- 할일 항목 옆에 연필을 누르면 '수정' 상태가 되고,
할일 내용을 간단히 수정할 수 있습니다.

- 할일 항목 옆에 X 를 누르면 할일 항목을 삭제할 수 있습니다.

- 사이트 오른쪽 하단에 + 버튼을 누르면 할 일을 추가할 수 있습니다.
할 일은 내용, 시작 날짜, 마감 날짜, 카테고리를 선택할 수 있습니다.
- 할 일 추가를 취소하고 싶으면, + 버튼을 다시 눌러 원래 할일 목록 페이지로 돌아올 수 있습니다.



## 캘린더

주력으로 사용한 부분은 `캘린더` 입니다.
기본적인 CRUD는 빠르게 구현하도록 했고,  

처음 만들어보는 캘린더 뷰를 구현하는 데 시간이 많이 걸렸습니다.  

캘린더 UI를 만드는 것과 날짜 로직을 공부했고,  

캘린더에서 선택한 날짜를 가져와서 출력하고,  

또 이 날짜 데이터를 back으로 보내면서 JS와 JAVA의 Date 타입이 달라 변환이 필요하다는 것도 알게 되었습니다.

## API 명세

**1. getMyTasks**  

URL: /todo/tasks  

Method: GET  

Description: 현재 년/월에 대한 할 일을 조회합니다.  



**2. getTasks of the Day**  

URL: /todo/tasks/day  

Method: GET  

Description: 특정 날짜(day)의 모든 할 일을 조회합니다.  


**3. createTask**  

URL: /todo/tasks  

Method: POST  

Description: 새로운 할 일을 등록합니다.  



**4. removeTask**  

URL: /todo/tasks/{taskCode}  

Method: DELETE  

Description: 특정 할 일을 삭제합니다.  

Path Variables:  

taskCode (Long): 삭제할 할 일의 코드  


**5. getPublicCategories**  

URL: /category  

Method: GET  

Description: 공개된 카테고리 목록을 조회합니다. 자신이 설정한 카테고리와 다른 사용자와 공유된 카테고리가 포함됩니다.  


