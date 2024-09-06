import axios from "axios";
import { useEffect, useState } from "react";


const Todo = () => {


    const [categoryNames, setCategoryNames] = useState([]);

    const connect = async() => {

        const response = await axios.get("http://localhost:7777/category");
    
        console.log("응답 : ", response);
    
        if(response.status !== 400){ // if는 좋은 내용
            setCategoryNames(response.data?.map(it => it.categoryName));
        }else{
    
          alert(response.data);
        }
    }


    useEffect(() => {
        connect();
    }, []);

    


     //////
     const [currentDate, setCurrentDate] = useState(new Date());
     const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
     const formatter = new Intl.DateTimeFormat('en-US', { month: 'long' });

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
 
     // 새로운 변수를 사용하여 주별 날짜를 얻습니다.
     const weeks = getDaysInMonthByWeeks(currentDate);


    return <div className="todo-app">

        <div className="calendar-container">

        <div className="calendar">
            <div className="header">
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
                    {'<'}
                </button>
                

                <h2>{formatter.format(currentDate)} {currentDate.getFullYear()}</h2>
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
                    {'>'}
                </button>
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
                            <div key={dayIndex} className={`day ${day ? '' : 'empty-day'}`}>
                                {day ? day.getDate() : ''}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>

            <button style={{width: "200px"}}  onClick={() => connect()}>버튼</button>
        </div>


        <div className="taskList">

            <select style={{background: "#4f5b6f", border: "none", borderRadius: "5px",}}>
                {categoryNames.map((name, idx) => (
                    <option  value={name} key={idx}>
                        {name}
                    </option>
                ))}
            </select>

        </div>

        

    </div>



}

export default Todo;