import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container } from 'react-bootstrap';
import logo from './logo.png';//이거 퍼블릭 폴더에 넣기
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'
import InputSeq from './pages/inputSeq.js'

function App() {

let navigate = useNavigate();

  return (
    <div className="App">
      
       <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand onClick={() => {
            navigate('/')
          }}>
            <img
              alt="VirusDecode Logo"
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            VirusDecode
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Routes>
        <Route path='/' element={<div>
          <div className='main-bg'></div>
          <div className='text-box'>
            Decode the virus’s genetic code,<br />
            analyze its mutations,<br />
            and determine the vaccine sequence.
          </div>
          <button className="image-button" onClick={()=>{navigate('inputSeq')}}></button>
        </div>} />
        <Route path='/analysis' element={<div>분석 결과를 출력하는 페이지입니다.</div>} />
        <Route path='/inputSeq' element={<InputSeq />} />
        
      </Routes>

 


    </div>
  );
}

export default App;
