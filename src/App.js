import './App.css';
import Todo from './component/todo/Todo';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';


function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/todo' element={<Todo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
