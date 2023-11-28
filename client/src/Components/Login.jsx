import React, { useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { LoginContainer, LoginBtn, LoginState } from './Login.style'
import { useSelector, useDispatch } from 'react-redux';
import { logout, loginSuccess } from '../pages/redux/actions';

function ComponentsLogin() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.isLoggedIn);  // isLoggedIn 상태 가져오기
  console.log(isLoggedIn)

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      dispatch(logout());
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      console.log(isLoggedIn);
    }
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    if (token && id) {
      axios.get('http://localhost:8000/user/payload', { headers: {'Authorization': token} })
      .then(response => {
        if (response.data.isSuccess) {
          dispatch(loginSuccess({ AccessToken: token, userId: id }));
        }
      })
      .catch(error => {
        if (error.response) {
          alert(error.response.data.message);
          dispatch(logout());
          localStorage.removeItem('token');
          localStorage.removeItem('id');
        }
      });
    }
  }, [dispatch]);

  return (
    <LoginContainer>
      {isLoggedIn ? (
        <>
          <LoginBtn onClick={handleLogout}>로그아웃</LoginBtn>
          <LoginState>환영합니다!</LoginState>
        </>
      ) : (
        <>
          <Link to="/Login">
            <LoginBtn>로그인</LoginBtn>
          </Link>
          <LoginState>로그인이 필요합니다.</LoginState>
        </>
      )}
    </LoginContainer>
  );
}

export default ComponentsLogin;