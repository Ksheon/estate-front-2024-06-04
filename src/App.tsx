import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router';
import {  AUTH_ABSOULUTE_PATH, AUTH_PATH, LOCAL_ABSOLUTE_PATH, LOCAL_PATH, QNA_DETAIL_PATH, QNA_PATH, QNA_UPDATE_PATH, QNA_WRITE_PATH, RATIO_PATH, SERVICE_PATH, SNS_PATH } from './constant';
import Authentication, { Sns } from './views/Authentication';
import ServiceContainer from './layouts/ServiceContainer';
import Local from './views/Service/Local';
import Ratio from './views/Service/Ratio';
import QnaList from './views/Service/qna/QnaList';
import QnaWrite from './views/Service/qna/QnaWrite';
import QnaDetail from './views/Service/qna/QnaDetail';
import QnaUpdate from './views/Service/qna/QnaUpdate';
import NotFound from './views/NotFound';
import { useCookies } from 'react-cookie';

//                  component: root 경로 컴포넌트                   //
function Index() {

  //                  function                  //
  const navigator = useNavigate();

  //                  state                  //
  const [cookies] = useCookies();

  //                  effect                  //
  useEffect(() => {

    const accessToken = cookies.accessToken;
    if (accessToken) navigator(LOCAL_ABSOLUTE_PATH);
    else navigator(AUTH_ABSOULUTE_PATH);

  }, []);

  return <></>
}

//                  component: Application 컴포넌트                   //
function App() {

  console.log(process.env.REACT_APP_ENVIRONMENT);

  //                  render                  //
  return (
    <Routes>
      <Route index element={<Index/>}/>
      <Route path={SNS_PATH} element={<Sns/>}/>
      <Route path={AUTH_PATH} element={<Authentication/>}></Route>

      <Route path={SERVICE_PATH} element={<ServiceContainer/>}>
        <Route path={LOCAL_PATH} element={<Local/>}/>
        <Route path={RATIO_PATH} element={<Ratio/>}/>

        <Route path={QNA_PATH}>
          {/* 공통요소 표현을 위해 */}
          <Route index element={<QnaList/>}/>
          {/* 위부터 순서대로 읽기 때문에 패턴만 있는 경우를 아래 쪽으로 */}  
          <Route path={QNA_WRITE_PATH} element={<QnaWrite/>}/>
          <Route path={QNA_DETAIL_PATH} element={<QnaDetail/>}/>
          <Route path={QNA_UPDATE_PATH} element={<QnaUpdate/>}/>
        </Route>

      </Route>
      <Route path='*' element={<NotFound/>}/>
    
    </Routes>
  );
}

export default App;
