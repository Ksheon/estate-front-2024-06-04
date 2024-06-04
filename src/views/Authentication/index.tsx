import React, { ChangeEvent, KeyboardEvent, KeyboardEventHandler, useEffect, useState } from 'react'
import './style.css'

import SignInBackground from 'src/assets/img/sign-in-background.png'
import SignUpBackground from 'src/assets/img/sign-up-background.png'
import InputBox from 'src/components/Inputbox';
import { EmailAuthCheckRequestDto, EmailAuthRequestDto, IdCheckRequestDto, SignInRequestDto, SignUpRequestDto } from 'src/apis/auth/dto/request';
import { emailAuthCheckRequest, emailAuthRequest, idCheckRequest, signUpRequest, signInRequest } from 'src/apis/auth';
import ResponseDto from 'src/apis/response.dto';
import { SignInResponseDto } from 'src/apis/auth/dto/response';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';
import { LOCAL_ABSOLUTE_PATH, SNS_SIGN_IN_REQUEST_URL } from 'src/constant';

//                  Component                   //
export function Sns () {

    //                  State                   //
    const {accessToken, expires} = useParams();
    const [cookies, setCookie] = useCookies();

    //                  Function                    //
    const navigator = useNavigate();

    //                  Effect                  //
    useEffect(() => {
        if (!accessToken || !expires) return;
        const expiration = new Date(Date.now() + (Number(expires)*1000));
        setCookie('accessToken', accessToken, {path: '/', expires: expiration});

        navigator(LOCAL_ABSOLUTE_PATH);
    }, []);

    //                  Render                  //
    return <></>;
}

type AuthPage = 'sign-in' | 'sign-up';

interface SnsContainerProps {
    title: string;
}

//                  Component                   //
function SnsContainer ({title}: SnsContainerProps) {

    const onSnsButtonClickHandler = (type: 'kakao' | 'naver') => {
        window.location.href = SNS_SIGN_IN_REQUEST_URL(type);
    };

    return(
        <div className='authentication-sns-container'>
            <div className='sns-container-title label'>{title}</div>
            <div className='sns-button-container'>
                <div className='sns-button kakao-button' onClick={() => onSnsButtonClickHandler('kakao')}></div>
                <div className='sns-button naver-button' onClick={() => onSnsButtonClickHandler('naver')}></div>
            </div>
        </div>
    );
};

interface Props {
    // 함수의 타입 선언 시 > 화살표 함수로 매개변수 + 리턴 값 입력
    onLinkClickHandler: () => void;
}

//                  component                   //
function SignIn ({onLinkClickHandler}: Props) {

    //                  state                   //
    const [cookies, setCookie] = useCookies();

    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [message, setMessage] = useState<string>('');

    //                  function                   //
    const navigator = useNavigate();

    const signInResponse = (result: SignInResponseDto | ResponseDto | null) => {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '아이디와 비밀번호를 모두 입력하세요.' :
            result.code === 'SF' ? '로그인 정보가 일치하지 않습니다.' :
            result.code === 'TF' ? '서버에 문제가 있습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : ''

        setMessage(message);
        const isSuccess = result && result.code ==='SU';
        if (!isSuccess) return;

        // result >> signInResponseDto, ResponseDto 타입 >> ResponseDto에는 accessToken, expires X >> as를 통해 타입 강제
        const {accessToken, expires} = result as SignInResponseDto;
        const expiration = new Date(Date.now() + (expires*1000));
        setCookie('accessToken', accessToken, {path: '/', expires: expiration});

        navigator(LOCAL_ABSOLUTE_PATH);
    };
    //                  event handler                   //
    //                                                 input에 대한 change 이벤트 발생 시
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setId(event.target.value);
        setMessage('');
    };
    
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setMessage('');
    };

    // InputBox에 사용하는 경우
    const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            return onSignInButtonClickHandler();
        }
    }

    // div에 사용
    // const onPasswordKeyDownHandler = (event: KeyboardEvent) => {
    //     if(event.key === 'Enter') {
    //         return onSignInButtonClickHandler();
    //     }
    // }

    const onSignInButtonClickHandler = () => {

        if (!id || !password) {
            setMessage('아이디와 비밀번호를 모두 입력하세요.');
            return;
        }

        const requestBody: SignInRequestDto = {
            userId: id,
            userPassword: password
        }
        signInRequest(requestBody).then(signInResponse);

    };

    //                  render                  //
    return(
        <div className='authentication-contents'>
            <div className='authentication-input-container' onKeyDown={onPasswordKeyDownHandler}>
                <InputBox label='아이디' type='text' value={id} placeholder='아이디를 입력해주세요' onChangeHandeler={onIdChangeHandler}/>
                <InputBox label='비밀번호' type='password' value={password} placeholder='비밀번호를 입력해주세요' onChangeHandeler={onPasswordChangeHandler} message={message} error/>
            </div>
            <div className='authentication-button-container'>
                <div className="primary-button full-width" onClick={onSignInButtonClickHandler}>로그인</div>
                <div className="text-link" onClick={onLinkClickHandler}>회원가입</div>
            </div>
            <div className='short-divider'></div>
            <SnsContainer title='sns 로그인'/>
        </div>
    )
}

//                  component                   
function SignUp ({onLinkClickHandler}: Props) {

    //                  state                    // 
    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>("");
    const [passwordCheck, setpasswordCheck] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [authNumber, setAuthNumber] = useState<string>("");

    const [idButtonStatus, setidButtonStatus] = useState<boolean>(false);
    const [emailButtonStatus, setEmailButtonStatus] = useState<boolean>(false);
    const [authNumberButtonStatus, setAuthNumberButtonStatus] = useState<boolean>(false);

    const [isIdCheck, setIdCheck] = useState<boolean>(false);
    const [isPasswordPattern, setPasswordPattern] = useState<boolean>(false);
    const [isEqualPassword, setEqualPassword] = useState<boolean>(false);
    const [isEmailCheck, setEmailCheck] = useState<boolean>(false);
    const [isAuthNumberCheck, setAuthNumberCheck] = useState<boolean>(false);

    const isSignUpActive = isIdCheck && isEmailCheck && isAuthNumberCheck && isPasswordPattern && isEqualPassword;

    const [idMessage, setIdMessage] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
    const [emailMessage, setEmailMessage] = useState<string>('');
    const [authNumberMessage, setAuthNumberMessage] = useState<string>('');

    const [isIdError, setIdError] = useState<boolean>(false);
    const [isEmailError, setEmailError] = useState<boolean>(false);
    const [isAuthNumberError, setAuthNumberError] = useState<boolean>(false);

    const signUpButtonClass = isSignUpActive ? 'primary-button full-width' : 'disable-button full-width';
    // const signUpButtonClass = (isSignUpActive ? 'primary' : 'disable') + '-button full-width';
    // const signUpButtonClass = isSignUpActive ? `${isSignUpActive ? 'primary' : 'disable'}-button full-width`

    //                  function                   //
    const idCheckResponse = (result: ResponseDto | null) => {


        const idMessage = 
            !result ? '서버에 문제가 있습니다.' : 
            result.code === 'VF' ? '아이디는 빈값 혹은 공백으로만 이루어질 수 없습니다.' :
            result.code === 'DI' ? '이미 사용중인 아이디 입니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' :
            result.code === 'SU' ? '사용 가능한 아이디 입니다.' : '';

        const idError = !(result && result.code === 'SU');
        const idCheck = !idError;

        setIdMessage(idMessage);
        setIdError(idError);
        setIdCheck(idCheck);
    };

    const emailAuthResponse = (result: ResponseDto | null) => {
        
        const emailMessage = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '이메일 형식이 아닙니다.' :
            result.code === 'DE' ? '중복된 이메일 입니다.' :
            result.code === 'MF' ? '인증번호 전송에 실패했습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' :
            result.code === 'SU' ? '인증번호가 전송되었습니다.' : ''

        const emailCheck = result !== null && (result.code === 'SU');
        const emailError  = !emailCheck;

        setEmailMessage(emailMessage);
        setEmailCheck(emailCheck);
        setEmailError(emailError);
    }

    const emailAuthCheckResponse = (result: ResponseDto | null) => {

        const authNumberMessage = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '인증번호를 입력해주세요' :
            result.code === 'AF' ? '인증번호가 일치하지 않습니다' :
            result.code === 'DBE' ? '서버에 문제가 있습니다' :
            result.code === 'SU' ? '인증번호가 확인되었습니다' : ''

        const authNumberCheck = result !== null && (result.code === 'SU');
        const authNumberError = !authNumberCheck;

        setAuthNumberMessage(authNumberMessage)
        setAuthNumberCheck(authNumberCheck);
        setAuthNumberError(authNumberError)
    } 

    const signUpResponse = (result: ResponseDto | null) => {

        const message = 
            !result ? '서버에 문제가 있습니다' :
            result.code === 'VF' ? '입력형식이 맞지 않습니다.' :
            result.code === 'DI' ? '이미 사용중인 아이디 입니다.' :
            result.code === 'DE' ? '중복된 이메일 입니다.' :
            result.code === 'AF' ? '인증번호가 일치하지 않습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : ''

        if (result == null || result.code !== 'SU') {
            alert(message);
            return;
        }

        const isSuccess = result == null || result.code === 'SU';
        if (!isSuccess) {
            alert(message);
            return;
        } 

        onLinkClickHandler();
        
    }

    //                  event Handler                   //
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setId(value);
        setidButtonStatus(value !== '');
        setIdCheck(false);
        setIdMessage('');
    };
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setPassword(value);
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
        const isPasswordPattern = passwordPattern.test(value);
        setPasswordPattern(isPasswordPattern);
        const passwordMessage = 
            isPasswordPattern ? '' : value ? '영문, 숫자를 혼용하여 8 ~ 13자 입력해주세요' : '';
        setPasswordMessage(passwordMessage);

    };
    const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setpasswordCheck(value);
        const isEqualPassword = password === value;

        setEqualPassword(isEqualPassword);
        const passwordCheckMessage = 
            isEqualPassword ? '' : value ? '비밀번호가 일치하지 않습니다.' : '';
        setPasswordCheckMessage(passwordCheckMessage);
    };
    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setEmail(value);
        setEmailButtonStatus(value !== '');
        setEmailCheck(false);
        setAuthNumberCheck(false);
        setEmailMessage('')
    };
    const onNumChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setAuthNumber(value);
        setAuthNumberButtonStatus(value !== '');
        setAuthNumberCheck(false);
        setAuthNumberMessage('');
    };

    const onIdButtonClickHandler = () => {
        if (!idButtonStatus) return;
        if (!id || !id.trim()) return;

        // IdCheckRequestDto 타입의 requestbody에 userId 담기
        const requestBody: IdCheckRequestDto = {userId: id};
        // 전송
        // IdCheckRequest에서 result값 반환
        idCheckRequest(requestBody).then(idCheckResponse);
    }
    const onEmailButtonClickHandler = () => {
        if (!emailButtonStatus) return;

        const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,3}$/;
        const isEmailPattern = emailPattern.test(email);
        if (!isEmailPattern) {
            setEmailMessage('이메일 형식이 아닙니다.');
            setEmailError(true);
            setEmailCheck(false);
            return;
        }

        const requestBody: EmailAuthRequestDto = {userEmail: email};
        emailAuthRequest(requestBody).then(emailAuthResponse);
    }

    const onAuthNumButtonClickHandler = () => {
        if (!authNumberButtonStatus) return;
        if (!authNumber) return;
        
        const requestBody: EmailAuthCheckRequestDto = {
            userEmail: email,
            authNumber
        }
        emailAuthCheckRequest(requestBody).then(emailAuthCheckResponse)
    }

    const onSignUpButtonClickHandler = () => {
        if (!isSignUpActive) return;
        if (!id || !password || ! passwordCheck || !email || !authNumber) {
            alert('모든 내용을 입력해주세요');
            return;
        }
        
        const requestBody: SignUpRequestDto = {
            userId: id,
            userPassword: password,
            userEmail: email,
            authNumber
        }
        signUpRequest(requestBody).then(signUpResponse);
    };

    //                  render                  //
    return (
        <div className='authentication-contents'>
            <SnsContainer title='SNS 회원가입'/>
            <div className='short-divider'></div>
            <div className='authentication-input-container'>

                <InputBox label='아이디' type='text' value={id} placeholder='아이디를 입력해주세요' onChangeHandeler={onIdChangeHandler} buttonTitle='중복 확인' 
                buttonStatus={idButtonStatus} onIdButtonClickHandler={onIdButtonClickHandler} message={idMessage} error={isIdError}/>

                <InputBox label='비밀번호' type='password' value={password} placeholder='비밀번호를 입력해주세요' 
                onChangeHandeler={onPasswordChangeHandler} message={passwordMessage} error/>

                <InputBox label='비밀번호 확인' type='password' value={passwordCheck} placeholder='비밀번호를 입력해주세요' onChangeHandeler={onPasswordCheckChangeHandler} message={passwordCheckMessage} error/>

                <InputBox label='이메일' type='text' value={email} placeholder='이메일 주소를 입력해주세요' onChangeHandeler={onEmailChangeHandler} buttonTitle='이메일 인증'
                buttonStatus={emailButtonStatus} onIdButtonClickHandler={onEmailButtonClickHandler} message={emailMessage} error={isEmailError}/>

                {
                isEmailCheck &&
                <InputBox label='인증번호' type='text' value={authNumber} placeholder='인증번호 4자리를 입력해주세요' onChangeHandeler={onNumChangeHandler} 
                buttonTitle='인증 확인' buttonStatus={authNumberButtonStatus} onIdButtonClickHandler={onAuthNumButtonClickHandler} message={authNumberMessage} error={isAuthNumberError}/>
                }

            </div>
            <div className='authentication-button-container'>
                <div className={signUpButtonClass} onClick={onSignUpButtonClickHandler}>회원가입</div>
                <div className="text-link" onClick={onLinkClickHandler}>로그인</div>
            </div>
        </div>
    )
}

//                  component                   //
export default function Authentication () {

    //                  state                   //
    // use- 함수 = 훅함수 > 반드시 컴포넌트 바로 아래에 선언되어 있어야 한다
    const [page, setPage] = useState<AuthPage>('sign-in');

    //                  event handler                   //
    const onLinkClickHandler = () => {
        if (page === 'sign-in') setPage('sign-up');
        else setPage('sign-in');
    }

    const AuthenticationContents = page === 'sign-in' ? <SignIn onLinkClickHandler={onLinkClickHandler}/> : <SignUp onLinkClickHandler={onLinkClickHandler}/>;

    const imageboxStyle = {backgroundImage: `url(${page === 'sign-in' ? SignInBackground : SignUpBackground})`};

    //                  render                  //
    return (
        <div id='authentication-wrapper'>
            <div className='authentication-image-box' style={imageboxStyle}></div>
            <div className='authentication-box'>
                <div className='authentication-container'>
                    <div className='authentication-title h1'>{'임대 주택 가격 서비스'}</div>
                    {AuthenticationContents}
                </div>
            </div>
        </div>
    )
}
