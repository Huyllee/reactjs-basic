import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postLoginApi } from "../services/userService";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import { handleLoginRedux } from '../redux/actions/userAction';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";

const Login = () => {

    const { loginContext } = useContext(UserContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const isLoading = useSelector(state => state.user.isLoading);
    const account = useSelector(state => state.user.account);

    const [loadingApi, setLoadingApi] = useState(false);

    useEffect(() => {
        if (account && account.auth === true) {
            navigate('/');
        }
    }, [account])

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error('Email/Password is required!');
            return;
        }
        // setLoadingApi(true)

        dispatch(handleLoginRedux(email, password))
        // let res = await postLoginApi(email.trim(), password);
        // if (res && res.token) {
        //     loginContext(email, res.token);
        //     navigate('/');
        // } else {
        //     if (res && res.status === 400) {
        //         toast.error(res.data.error);
        //     }
        // }
        // setLoadingApi(false)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            handleLogin();
        }
    }

    return (
        <>
            <div className="login-container col-12 col-sm-4">
                <div className="title">Login</div>
                <div className="text">Email or Username (eve.holt@reqres.in)</div>
                <input
                    type="text"
                    placeholder="Email or username..."
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <div className="password">
                    <input
                        type={showPassword === false ? 'password' : 'text'}
                        placeholder="Password..."
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        onKeyDown={(event) => handleKeyDown(event)}
                    />
                    <i
                        className={showPassword === false ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                        onClick={() => handleShowPassword()}
                    ></i>
                </div>

                <button
                    className={email && password ? 'active' : ''}
                    disabled={email && password ? false : true}
                    onClick={() => handleLogin()}>
                    {isLoading && <i className="fas fa-spinner fa-spin"></i>} Login
                </button>
                <div className="back">
                    <Link className='go-back' to='/'><i className="fa-solid fa-angles-left"></i> Go back</Link>
                </div>
            </div>
        </>
    )
}

export default Login;