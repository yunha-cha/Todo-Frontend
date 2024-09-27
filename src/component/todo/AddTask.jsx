const AddTask = ({newTask, setNewTask, handleTaskRegist, categoryList}) => {

    const onChangeTask = (e) => {
        const { name, value } = e.target;
        setNewTask(t => ({
            ...t,
            [name]: value
        }));
    }


    return <div className="AddTask">
                <h1 className="selected-date">할 일 등록</h1><br />
                <input type="text" name="taskContent" placeholder="할 일 입력" onChange={onChangeTask} value={newTask.taskContent}/><br /><br />
                <input type="date" name="taskStartDate" onChange={onChangeTask} value={newTask.taskStartDate}/><br /><br />
                <input type="date" name="taskEndDate" onChange={onChangeTask} value={newTask.taskEndDate}/><br /><br />
                <select 
                name="taskCategoryCode"
                onChange={onChangeTask}
                value={newTask.taskCategoryCode}>
                {categoryList.map((category, idx) => 
                    <option key={idx} value={category.categoryCode}>{category.categoryName}</option>
                )}
                </select><br /><br />
                <button onClick={handleTaskRegist}>추가하기</button>
            </div>
}

export default AddTask;