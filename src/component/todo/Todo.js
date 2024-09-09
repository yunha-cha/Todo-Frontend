import axios from "axios";
import { useEffect, useState } from "react";
import './Todo.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-regular-svg-icons";


const Todo = () => {


    const [categoryNames, setCategoryNames] = useState([]);
    const [taskList, setTaskList] = useState([]);
    const [currentCategory, setCurrentCategory] = useState("전체");
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [taskLoad, setTaskLoad] = useState(false);
    const [taskOfMonth, setTaskOfMonth] = useState([]);
    /* 캘린더 계산 */
    const [currentDate, setCurrentDate] = useState(new Date());
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'long' });




    const getCategoryList = async() => {

        const response = await axios.get("http://localhost:7777/category", {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        });
        console.log("응답 : ", response?.data);
    
        if(response.status !== 400){ // if는 좋은 내용
            setCategoryNames(response?.data);
        }else{
    
          alert(response.data);
        }
    }

    
    const getTaskOfMonth = async() => {

        setTaskLoad(false);

        let calendarDate = currentDate.toISOString().split('T')[0];
        const response = await axios.get(`http://localhost:7777/todo/tasks?calendarDate=${calendarDate}`, {
            headers: {
                Authorization: localStorage.getItem('token')
            },
        });
        console.log(response.data.data);
        setTaskOfMonth(response.data.data);
        setTaskLoad(true);
    }
    const getTaskOfDay = async() =>{
        setTaskLoad(false);

        const selectedDate = selectedDay.toISOString().split('T')[0];
        const res = await axios.get(`http://localhost:7777/todo/tasks/day?day=${selectedDate}`, {
            headers: {
                Authorization: localStorage.getItem('token')
            },
        });
        if(res.status === 400){
            alert('나중에 에러처리');
        } else{
            setTaskLoad(true);
            setTaskList(res.data.data);
        }
  
    }

     const getDaysInMonth = (date) => {
         const year = date.getFullYear();
         const month = date.getMonth();
         const end = new Date(year, month + 1, 0);
         const days = [];
 
         for (let i = 1; i <= end.getDate(); i++) {
             days.push(new Date(year, month, i));
         }
         return days;
     };
 
     const getFirstDayOfMonth = (date) => {
         return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
     };
 
     const getDaysInMonthByWeeks = (date) => {
         const days = getDaysInMonth(date);
         const firstDayOfMonth = getFirstDayOfMonth(date);
         const weeks = [];
         let week = Array(firstDayOfMonth).fill(null); // Fill the first week with null values for days before the start of the month
 
         days.forEach(day => {
             if (week.length === 7) {
                 weeks.push(week);
                 week = [];
             }
             week.push(day);
         });
 
         if (week.length > 0) {
             // Fill the last week with null values for days after the end of the month
             while (week.length < 7) {
                 week.push(null);
             }
             weeks.push(week);
         }
 
         return weeks;
     };
 
     // 주 별 날짜
     const weeks = getDaysInMonthByWeeks(currentDate);


     useEffect(() => {
        getCategoryList();
        getTaskOfMonth();
    }, []);

    useEffect(()=>{
        getTaskOfDay();
        setCurrentCategory('전체');
    },[selectedDay])

    const isEventDay = (date) => {
        if (date) {
            let day = date.getDate();
            return taskOfMonth.some(it => day === it.taskStartDate[2]);
        } else {
            return false;       
        }
    }
    
    

    return <div className="App">
    <div className="container">

    <div className="todo-app">

    <div className="calendar-container">

        <div className="calendar">

            <div className="header">
                <button onClick={() => {
                    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))
                    getTaskOfMonth();
                    }}>
                    {'<'}
                </button>
                <h2>{formatter.format(currentDate)} {currentDate.getFullYear()}</h2>
                <button onClick={() => {
                    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))
                    getTaskOfMonth();
                    }}>
                    {'>'}
                </button>
            </div>

            <div className="days-of-week">
                {daysOfWeek.map(day => (
                    <div key={day} className="day-name">{day}</div>
                ))}
            </div>

            <div className="days">
                {/* 그 날짜에 데이터가 있으면 있음이라고 띄워보기 */}
                {/* day.getDate()가 가져온 오브젝트에 날짜에 포함되어있으면 있음 이라고 띄우면 됨 */}
                {/* 가졍혼 오브젝트의 스타드데이트랑 일치하면 있음이라고 찍자. */}
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="week">
                        {week.map((day, dayIndex) => (
                            <div onClick={() => {
                                setSelectedDay(day);
                            }} key={dayIndex} className={`day ${day ? '' : 'empty-day'}`}
                                style={{backgroundColor : day && (day.getDate() === selectedDay.getDate())
                                    && (day.getMonth() === selectedDay.getMonth())
                                    && (day.getFullYear() === selectedDay.getFullYear())
                                 ? "#4e5671d6" : "", color: isEventDay(day) ? 'red' : 'black'}}>
                                {day ? day.getDate() : ''}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

        </div>

        <div style={{display: "flex",justifyContent: "space-between"}}>
            <div></div>
            <button className="today-btn" onClick={() => {
                setSelectedDay(new Date());
                setCurrentDate(new Date());
            }}>Today</button>
        </div>

    </div>

        {/* 오른쪽 UI
        - header에 카테고리 추가/관리 메뉴, 카테고리 필터링 드롭다운
        - 캘린더 날짜를 클릭하면 해당 할 일 리스트
        - 카테고리 관리 누르면 카테고리 관리 페이지로 */}
        
        <div className="task-container">

            {/* 카테고리 설정으로 이동 */}
            <header style={{display: "flex", justifyContent:"space-between", marginBottom: "20px"}}>
                <h1 className="selected-date">{selectedDay.getFullYear()}.{selectedDay.getMonth()+1}.{selectedDay.getDate()}</h1>
                <select style={{background: "#4f5b6f", border: "none", borderRadius: "5px",}}>
                    <option value={''}>카테고리 추가</option>
                    <option value={''}>카테고리 관리</option>
                </select>
            </header>


            {/* 할일 리스트 */}

            {taskLoad ? 
            <>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <select style={{background: "#4f5b6f", border: "none", borderRadius: "5px"}} onChange={(e) => {setCurrentCategory(e.target.value); console.log(currentCategory);}}>
                        <option value="전체">전체</option>
                        {categoryNames.map((category) => (
                            <option value={category.categoryName} key={category.categoryCode}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="taskList">
                {
                    taskList.length === 0 ? 
                        <></>
                            : 
                        (currentCategory === "전체" ?
                            taskList.map((task, idx) => 
                                <div className="task">
                                    <FontAwesomeIcon icon={faCircle} size="sm" style={{color: "rgb(55, 73, 176)",}} />
                                    <div>{task.taskContent}</div>
                                    <div>카테고리 : {task.categoryName}</div>
                                </div>
                            )
                            :
                            taskList.filter((task) => task.taskCategoryName === currentCategory).map((task, idx) => 
                                    <div className="task">
                                        <FontAwesomeIcon icon={faCircle} size="sm" style={{color: "rgb(55, 73, 176)",}} />
                                        <div>{task.taskContent}</div>
                                        <div>카테고리 : {task.categoryName}</div>
                                    </div>
                            )
                        )
                }
                </div>
            </> 
            : 
            <>
            </>}
          


        </div>

    </div>
    </div>
    </div>



}

export default Todo;