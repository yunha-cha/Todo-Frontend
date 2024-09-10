import './App.css';
import Todo from './component/todo/Todo';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Join from './Join';


function App() {
  return(
    <div className="container">
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/join' element={<Join />} />
        <Route path='/todo' element={<Todo />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
