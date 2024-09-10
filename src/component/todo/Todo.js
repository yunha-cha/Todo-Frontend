import axios from "axios";
import { useEffect, useState } from "react";
import './Todo.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft, faChevronRight, faCirclePlus, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";

const Todo = () => {


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
        console.log("응답 : ", response?.data);
    
        if(response.status !== 400){
            setCategoryNames(response?.data);
        }else{
    
          alert(response.data);
        }
    }

    
    const getTaskOfMonth = async() => {

        let calendarDate = currentDate.toISOString().split('T')[0];
        const response = await axios.get(`http://localhost:7777/todo/tasks?calendarDate=${calendarDate}`, {
            headers: {
                Authorization: localStorage.getItem('token')
            },
        });
        console.log(response.data.data);
        setTaskOfMonth(response.data.data);

    }


    const getTaskOfDay = async() =>{

        const selectedDate = selectedDay.toLocaleDateString('en-CA').split('T')[0];
        const res = await axios.get(`http://localhost:7777/todo/tasks/day?day=${selectedDate}`, {
            headers: {
                Authorization: localStorage.getItem('token')
            },
        });
        if(res.status === 400){
            alert('page error');
        } else{
            setTaskList(
                res.data.data.map(item => ({ ...item, isEditing: false }))
            );
        }

    }



    const onChangeRegist = (e) => {

        const { name, value } = e.target;

        console.log(name, value);
         setnewTask(t => ({
            ...t,
            [name]: value
        }));

        console.log(newTask);
    }


    // 할일 등록
    const handleRegist = () => {

        const form = new FormData();
        form.append('taskCode', newTask.taskCode);
        form.append('taskContent', newTask.taskContent);
        form.append('taskStartDate', newTask.taskStartDate);
        form.append('taskEndDate', newTask.taskEndDate);
        form.append('taskState', newTask.taskState);
        form.append('taskUserName', newTask.taskUserName);
        form.append('taskCategoryName', newTask.taskCategoryName);

        const res = axios.post(`http://localhost:7777/todo/tasks`,form,{
            headers:{
                Authorization: localStorage.getItem('token')
            }
        })

        alert("할 일이 추가되었습니다.");
        setTaskLoad(true);
        
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
        console.log(res);

    }

    
    
    // 할일 삭제
    const deleteTask = async(taskCode) => {
        const userResponse = window.confirm("삭제하시겠습니까?");
        if(userResponse){
            const res = await axios.delete(`http://localhost:7777/todo/tasks/${taskCode}`, {headers: {
                Authorization: localStorage.getItem('token')
            }});

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
        getCategoryList();
        getTaskOfMonth();

    }, []);

    useEffect(()=>{
        getTaskOfDay();
        setCurrentCategory('전체');
    },[selectedDay])

    useEffect(() => {
        console.log("taskList: ", taskList);
    },[taskList])




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
            </header>


            {/* 할일 리스트 */}
            {taskLoad ? 
            <>

                <div className="taskList">
                {
                    taskList.length === 0 ? 
                        <div style={{textAlign: "center", }}>할 일이 없습니다.</div>
                            : 
                        (currentCategory === "전체" ?
                            taskList.map((task, idx) => 
                                <div className="task" key={idx}>
                                    <FontAwesomeIcon icon={faCircle} size="sm" className="faCircle" />
                                    { task.isEditing ?
                                    <>
                                        <div style={{width:'100%' ,display: "flex", justifyContent:"space-between"}}>
                                            <input type="text" value={task.taskContent}  onChange={(e) => setTaskList(u =>{
                                                const update = [...u];
                                                update[idx] = {...update[idx], taskContent: e.target.value};
                                                return update;
                                            })}/>
                                            <FontAwesomeIcon icon={faChevronRight} fade className="faChevronRight" 
                                                onClick={() => {handleEdit(task.taskCode); handleEdited(task.taskContent,task.taskCode);}}
                                            />
                                        </div>
                                    </>
                                    :<div style={{width:'100%' ,display: "flex", justifyContent:"space-between"}}>
                                        <div style={{marginLeft: "10px"}}>{task.taskContent}</div>
                                        <div>
                                            {/* <FontAwesomeIcon icon={faPen} className="faPen" onClick={() => handleEdit(task.taskCode)} style={{color: "#829efb75",}}/>&nbsp;&nbsp;&nbsp; */}
                                            <FontAwesomeIcon icon={faXmark} className="faXmark" onClick={() => deleteTask(task.taskCode)} style={{color: "#829efb75",}}/>
                                        </div>
                                    </div>
                                    }
                                    
                                </div>
                            )
                            :
                            taskList.filter((task) => task.taskCategoryName === currentCategory).map((task, idx) => 
                                <div className="task" key={idx}>
                                    <FontAwesomeIcon icon={faCircle} size="sm" className="faCircle" />
                                    { task.isEditing ?
                                    <>
                                        <div style={{width:'100%' ,display: "flex", justifyContent:"space-between"}}>
                                            <input type="text" value={task.taskContent}  onChange={(e) => setTaskList(u =>{
                                                const update = [...u];
                                                update[idx] = {...update[idx], taskContent: e.target.value};
                                                return update;
                                            })}/>
                                            <FontAwesomeIcon icon={faChevronRight} fade className="faChevronRight" 
                                                onClick={() => {handleEdit(task.taskCode); handleEdited(task.taskContent,task.taskCode);}}
                                            />
                                        </div>
                                    </>
                                    :<div style={{width:'100%' ,display: "flex", justifyContent:"space-between"}}>
                                        <div style={{marginLeft: "10px"}}>{task.taskContent}</div>
                                        <div>
                                            {/* <FontAwesomeIcon icon={faPen} className="faPen" onClick={() => handleEdit(task.taskCode)} style={{color: "#829efb75",}}/>&nbsp;&nbsp;&nbsp; */}
                                            <FontAwesomeIcon icon={faXmark} className="faXmark" onClick={() => deleteTask(task.taskCode)} style={{color: "#829efb75",}}/>
                                        </div>
                                    </div>
                                    }
                                    
                                </div>
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