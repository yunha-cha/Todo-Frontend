import axios from "axios";
import { useEffect, useState } from "react";
import './Todo.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import TaskList from "./TaskList";
import { toHaveErrorMessage } from "@testing-library/jest-dom/dist/matchers";
import api from "../../axiosHandler";

const Todo = () => {

    const nav = useNavigate();
    const [categoryNames, setCategoryNames] = useState([]);
    const [taskList, setTaskList] = useState([]);
    const [currentCategory, setCurrentCategory] = useState("전체");
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [taskLoad, setTaskLoad] = useState(false);
    const [taskOfMonth, setTaskOfMonth] = useState([]);
    const [newTask, setnewTask] = useState({
        taskCode:1,
        taskContent: '',
        taskStartDate: '',
        taskEndtDate: '',
        taskState: false,
        taskUserName: '',
        taskCategoryName: ''
    })

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
        if(response.status === 403){
            nav('/');
        }
        if(response.status !== 400){
            setCategoryNames(response?.data);
        }else{
    
          alert(response.data);
        }
    }

    
    const getTaskOfMonth = async() => {
        let calendarDate = currentDate.toISOString().split('T')[0];
        const res = await api.get(`/todo/tasks?calendarDate=${calendarDate}`);
        setTaskOfMonth(res.data);
    }

    const getTaskOfDay = async() =>{
        const selectedDate = selectedDay.toLocaleDateString('en-CA').split('T')[0];
        const res = await api.get(`/todo/tasks/day?day=${selectedDate}`);
        setTaskList(res.data.map(item => ({ ...item, isEditing: false })));
    }



    const onChangeRegist = (e) => {

        const { name, value } = e.target;
        setnewTask(t => ({
            ...t,
            [name]: value
        }));

    }


    // 할일 등록
    const handleRegist = async() => {

        const form = new FormData();
        form.append('taskCode', newTask.taskCode);
        form.append('taskContent', newTask.taskContent);
        form.append('taskStartDate', newTask.taskStartDate);
        form.append('taskEndDate', newTask.taskEndDate);
        form.append('taskState', newTask.taskState);
        // form.append('taskUserName', newTask.taskUserName);

        const res = await axios.post(`http://localhost:7777/todo/tasks`,form,{
            headers:{
                Authorization: localStorage.getItem('token')
            }
        })
        if(res.status === 403){
            nav('/');
        }

        alert("할 일이 추가되었습니다.");
        setTaskLoad(false);
        getTaskOfDay();

    }




    // 할일 수정
    const handleEdit = (taskCode) => {        
        setTaskList(taskList.map(item => 
            item.taskCode === taskCode ? { ...item, isEditing: !item.isEditing } : item
        ));
    }


    const handleEdited = (taskContent,taskCode) => {
        const obj = {
            taskCode : taskCode,
            taskContent:taskContent,
        }

        const form = new FormData();
        form.append("taskCode",taskCode);
        form.append("taskContent",taskContent);
        const res = axios.post(`http://localhost:7777/todo/tasks`,form,{
            headers:{
                Authorization: localStorage.getItem('token')
            }
        })
        if(res.status === 403){
            nav('/');
        }

    }

    
    
    // 할일 삭제
    const deleteTask = async(taskCode) => {
        const userResponse = window.confirm("삭제하시겠습니까?");
        if(userResponse){
            const res = await axios.delete(`http://localhost:7777/todo/tasks/${taskCode}`, {headers: {
                Authorization: localStorage.getItem('token')
            }});
            if(res.status === 403){
                nav('/');
            }

            getTaskOfDay();
            getTaskOfMonth();
            alert(res.data);  
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
         let week = Array(firstDayOfMonth).fill(null);
 
         days.forEach(day => {
             if (week.length === 7) {
                 weeks.push(week);
                 week = [];
             }
             week.push(day);
         });
 
         if (week.length > 0) {
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
        if(!localStorage.getItem('token')){
            nav('/');
        }
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
            return taskOfMonth.some(it => day >= it.taskStartDate[2] && day <= it.taskEndDate[2]);
        } else {
            return false;       
        }
    }
    
    

    return <div className="todo-app">

    <div className="calendar-container">

        <div className="calendar">

            <div className="header">
                <FontAwesomeIcon icon={faChevronLeft} className="faChevronLeft" onClick={() => {
                    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))
                    getTaskOfMonth();
                    }}/>
                <h2>{formatter.format(currentDate)} {currentDate.getFullYear()}</h2>
                <FontAwesomeIcon icon={faChevronRight} className="faChevronRight" onClick={() => {
                    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))
                    getTaskOfMonth();
                    }}/>
            </div>

            <div className="days-of-week">
                {daysOfWeek.map(day => (
                    <div key={day} className="day-name">{day}</div>
                ))}
            </div>

            <div className="days">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="week">
                        {week.map((day, dayIndex) => (
                            <div onClick={() => {
                                setSelectedDay(day);
                            }} key={dayIndex} className={`day ${day ? '' : 'empty-day'}`}
                                style={{backgroundColor : day && (day.getDate() === selectedDay.getDate())
                                    && (day.getMonth() === selectedDay.getMonth())
                                    && (day.getFullYear() === selectedDay.getFullYear())
                                 ? "#829efb75" : "", color: isEventDay(day) ? 'rgb(130, 158, 251)' : 'black'}}>
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
        - header에 카테고리 필터링 드롭다운
        - 캘린더 날짜를 클릭하면 해당 할 일 리스트 */}
    
        <div className="task-container">

            <header style={{display: "flex", justifyContent:"space-between", marginBottom: "20px"}}>
                <h1 className="selected-date">{selectedDay.getFullYear()}.{selectedDay.getMonth()+1}.{selectedDay.getDate()}</h1>
                                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <select style={{background: "#4f5b6f", border: "none", borderRadius: "5px"}} onChange={(e) => {setCurrentCategory(e.target.value)}}>
                        <option value="전체">전체</option>
                        {categoryNames.map((category) => (
                            <option value={category.categoryName} key={category.categoryCode}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                </div>
            </header>


            {/* 할일 리스트 */}
            {!taskLoad ? 
            <>

                <div className="taskList">
                {
                    taskList.length === 0 ? 
                        <div style={{textAlign: "center", }}>할 일이 없습니다.</div>
                            : 
                        (currentCategory === "전체" ?
                            taskList.map((task, idx) => 
                               <TaskList idx={idx} task={task} handleEdit={handleEdit} handleEdited={handleEdited} deleteTask={deleteTask} setCategoryNames={setCategoryNames} setTaskList={setTaskList}/>
                            )
                            :
                            taskList.filter((task) => task.taskCategoryName === currentCategory).map((task, idx) => 
                                <TaskList idx={idx} task={task} handleEdit={handleEdit} handleEdited={handleEdited} deleteTask={deleteTask} setCategoryNames={setCategoryNames} setTaskList={setTaskList}/>

                            )
                        )
                }
                </div>
            </> 
            : 
            <>
                <div className="AddTask">
                    <div>할 일 추가</div><br />
                    <input type="text" name="taskContent" placeholder="내용" onChange={onChangeRegist}/><br /><br />
                    <input type="date" name="taskStartDate" onChange={onChangeRegist}/><br /><br />
                    <input type="date" name="taskEndDate" onChange={onChangeRegist}/><br /><br />
                    <button onClick={handleRegist}>추가하기</button>
                </div>
            </>}


            {/* 할 일 추가 버튼 */}
            <div style={{display: "flex", justifyContent: "flex-end"}}>
                <FontAwesomeIcon icon={faCirclePlus} className="faCirclePlus"  onClick={() => setTaskLoad(!taskLoad)} />
            </div>


        </div>

    </div>

}

export default Todo;