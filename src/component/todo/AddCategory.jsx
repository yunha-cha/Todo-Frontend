import api from "../../axiosHandler";

const AddCategory = ({newCategory, setNewCategory, handleCategoryRegist}) => {

    
    const onChangeCategory = (e) => {  // 카테고리 컴포넌트 안에
        const {name, value} = e.target;
        setNewCategory( c => ({
            ...c,
            [name]: value
        }))
     }



    return  <div className="AddCategory">
                <h1 className="selected-date">카테고리</h1><br /><br />
                <input type="text" name="categoryName" placeholder="카테고리 입력" onChange={onChangeCategory} value={newCategory.categoryName}/><br /><br />
                <select 
                    name="categoryIsPrivate"
                    onChange={onChangeCategory}
                    value={newCategory.categoryIsPrivate}>
                    <option value={false}>공개</option>
                    <option value={true}>비공개</option>
                </select><br /><br />
                <button onClick={handleCategoryRegist}>등록하기</button> <br /><br />
            </div>
}

export default AddCategory;