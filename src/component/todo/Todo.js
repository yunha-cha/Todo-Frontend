import axios from "axios";
import { useEffect, useRef, useState } from "react";
import './Todo.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faCirclePlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import api from "../../axiosHandler";
import AddCategory from "./AddCategory";
import Task from "./Task";
import AddTask from "./AddTask";

const Todo = () => {

    const nav = useNavigate();
    const [isOpenMenu, SetisOpenMenu] = useState(false);
    const [page, setPage] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [taskList, setTaskList] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(0);
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [menu, setMenu] = useState("할 일 보기");
    const [taskOfMonth, setTaskOfMonth] = useState([]);
    const [newTask, setNewTask] = useState({
        taskCode: 1,
        taskContent: '',
        taskStartDate: '',
        taskEndDate: '',
        taskState: false,
        taskUserName: '',
        taskCategoryCode: 0,
    });

    const [newCategory, setNewCategory] = useState({
        categoryName: '',
        categoryIsPrivate: false,

    });


    const boxRef = useRef(null);
    const [lastScrollTop, setLastScrollTop] = useState(0);

    const handleScroll = () => {
        const box = boxRef.current;
        const currentScrollTop = box.scrollTop;

        if(currentScrollTop > lastScrollTop){
            const isAtBottom = Math.abs(box.scrollHeight - box.scrollTop - box.clientHeight) < 1;
            if(isAtBottom){
                console.log('sss');
                getTaskOfDay();
            }
        }

        setLastScrollTop(currentScrollTop);
    }


    /* 캘린더 계산 */
    const [currentDate, setCurrentDate] = useState(new Date());
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'long' });


    /* 카테고리 관리 컴포넌트*/
    const CategoryList = () => {
        return  <div className="CategoryList">
                    <h1 className="selected-date">카테고리 관리</h1><br />
                        {categoryList.map((category) => 
                        <div style={{width:'80%' ,display: "flex", justifyContent:"space-between", paddingLeft: "10px"}} className="category">
                            {category.categoryName}
                            <div>
                                <FontAwesomeIcon icon={faXmark} className="faXmark" style={{color: "#829efb75",}} onClick={() => deleteCategory(category.categoryCode)}/>
                            </div>
                        </div>
                        )}
                </div>
    }


    const getCategoryList = async() => {
        const res = await api.get("/category");
        setCategoryList(res?.data);
    }

    const handleCategoryRegist = async() => {
        await api.post('/category', newCategory);
        alert("카테고리를 등록하였습니다.");
        getCategoryList();

    }


    const deleteCategory = async(categoryCode) => {

        if(window.confirm("삭제하시겠습니까?")){
            const res = await api.delete(`http://localhost:7777/category/${categoryCode}`);
            getCategoryList();
            alert(res.data);
        }
    }
    

    
    // 해당 년,월 데이터 가져오기
    const getTaskOfMonth = async() => {
        let calendarDate = currentDate.toISOString().split('T')[0];
        const res = await api.get(`/todo/tasks?calendarDate=${calendarDate}`);
        setTaskOfMonth(res.data);
    }


    const [lastPage, setLastPage] = useState(false);
    // 해당 일 데이터 가져오기
    const getTaskOfDay = async() =>{

        const selectedDate = selectedDay.toLocaleDateString('en-CA').split('T')[0];
        if(!lastPage){
            const res = await api.get(`/todo/tasks/day?day=${selectedDate}&page=${page}&size=10`);
            const newItems = res.data.content.map(item => ({ ...item, isEditing: false }))
            setTaskList(items => [ ...items, ...newItems]);
            setPage(page => page + 1);

            if(res.data.last){
                setLastPage(true);
            }
        }
        

    }

    useEffect(() => {
        if(page===0){
            getTaskOfDay();
        }
    }, [page])

    useEffect(()=>{
        
        setCurrentCategory(0);
        setPage(0);
        setLastPage(false);
        setTaskList([]);

    },[selectedDay])




    // 할일 등록
    const handleTaskRegist = async() => {

        const form = new FormData();
        form.append('taskCode', newTask.taskCode);
        form.append('taskContent', newTask.taskContent);
        form.append('taskStartDate', newTask.taskStartDate);
        form.append('taskEndDate', newTask.taskEndDate);
        form.append('taskState', newTask.taskState);
        form.append('taskUserName', newTask.taskUserName);
        form.append('taskCategoryCode', newTask.taskCategoryCode);

        await api.post(`/todo/tasks`,form);  //  등록      
        alert("할 일이 추가되었습니다.");
        setMenu("할 일 보기");
        getTaskOfDay();
        getTaskOfMonth();

    }


    // 할일 수정
    const handleEdit = (taskCode) => {        
        setTaskList(taskList.map(item => 
            item.taskCode === taskCode ? { ...item, isEditing: !item.isEditing } : item
        ));
    }


    const handleEdited = (taskContent,taskCode) => {
        const obj = {
            taskCode: taskCode,
            taskContent: taskContent,
        }

        const form = new FormData();
        form.append("taskCode",taskCode);
        form.append("taskContent",taskContent);
        api.post(`http://localhost:7777/todo/tasks`,form);

    }

    
    
    // 할일 삭제
    const deleteTask = async(taskCode) => {
        const userRes = window.confirm("삭제하시겠습니까?");
        if(userRes){
            const res = await api.delete(`http://localhost:7777/todo/tasks/${taskCode}`);
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



    const isEventDay = (date) => {
        if (date) {
            let day = date.getDate();
            return taskOfMonth.some(it => day >= it.taskStartDate[2] && day <= it.taskEndDate[2]);
        } else {
            return false;       
        }
    }



    /* 할 일 등록 컴포넌트 AddTask */
    
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
                                setMenu("할 일 보기");
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
    
        <div className="task-container">

            {/* 할일 리스트 */}
            {menu === "할 일 보기" && 
            <>
                <header style={{display: "flex", justifyContent:"space-between", marginBottom: "20px"}}>
                    <h1 className="selected-date">{selectedDay.getFullYear()}.{selectedDay.getMonth()+1}.{selectedDay.getDate()}</h1>
                                    <div style={{display: "flex", justifyContent: "flex-end"}}>
                        <select style={{background: "#4f5b6f", border: "none", borderRadius: "5px"}} value={currentCategory} onChange={(e) => setCurrentCategory(e.target.value)}>
                            <option value={0}>전체</option>
                            {categoryList.map((category) => (
                                <option key={category.categoryCode} value={category.categoryCode} >
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                    </div>
                </header>

                <div className="taskList"
                    ref={boxRef}
                    onScroll={handleScroll}
                    style={{
                        height: "500px",
                        overflowY: "scroll",
                    }}
                >
                {
                    taskList.length === 0 ? 
                        <div style={{textAlign: "center", }}>할 일이 없습니다.</div>
                            : 
                        (currentCategory == 0 ?
                            taskList.map((task, idx) => 
                                <Task idx={idx} task={task} handleEdit={handleEdit} handleEdited={handleEdited} deleteTask={deleteTask} setTaskList={setTaskList}/>
                            )
                            :
                            taskList.filter((task) => task.taskCategoryCode == currentCategory).map((task, idx) => 
                                <Task idx={idx} task={task} handleEdit={handleEdit} handleEdited={handleEdited} deleteTask={deleteTask} setTaskList={setTaskList}/>

                            )
                        )
                }
                </div>
            </>}
            {menu === "할 일 등록" && <AddTask newTask={newTask} setNewTask={setNewTask} handleTaskRegist={handleTaskRegist} categoryList={categoryList}/>}
            {menu === "카테고리 등록" && <AddCategory newCategory={newCategory} setNewCategory={setNewCategory} handleCategoryRegist={handleCategoryRegist}/>}
            {menu === "카테고리 관리" && <CategoryList />}


            {/* 메뉴버튼 */}
            <div style={{display: "flex", justifyContent: "flex-end"}}>
                <FontAwesomeIcon icon={faCirclePlus} className="faCirclePlus"  onClick={() => SetisOpenMenu(!isOpenMenu)} />
            </div>
            {isOpenMenu && (
            <div className={`menu`}>
                <span className='' onClick={() => setMenu("카테고리 등록")}>카테고리 등록</span>
                <span className='' onClick={() => setMenu("카테고리 관리")}>카테고리 관리</span>
                <span className='' onClick={() => setMenu("할 일 등록")}>할 일 등록</span>
                <span className='' onClick={() => setMenu("할 일 보기")}>할 일 보기</span>
            </div>
            )}

        </div>
    </div>

}

export default Todo;