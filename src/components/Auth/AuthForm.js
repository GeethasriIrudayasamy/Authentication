import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../Store/AuthContext";
import classes from "./AuthForm.module.css";

const AuthForm = () => {
    const history = useHistory();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const auth_ctx = useContext(AuthContext);

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };
    const submitHandler = (event) => {
        event.preventDefault();
        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;
        setIsLoading(true);
        let url;
        if (isLogin) {
            url =
                "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDWtM33apY0Lsd8CGEt_PkgmfozwSgL7os";
        } else {
            url =
                "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDWtM33apY0Lsd8CGEt_PkgmfozwSgL7os";
        }
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                email: enteredEmail,
                password: enteredPassword,
                returnSecureToken: true,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                setIsLoading(false);
                if (res.ok) {
                    event.target.reset();
                    return res.json();
                } else {
                    return res.json().then((data) => {
                        let errorMessage = "Authentication failed!";
                        throw new Error(errorMessage);
                    });
                }
            })
            .then((data) => {
                auth_ctx.login(data.idToken);
                event.target.reset();
                console.log(data);
                history.replace("/profile");
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    return (
        <section className={classes.auth}>
            <h1>{isLogin ? "Login" : "Sign Up"}</h1>
            <form onSubmit={submitHandler}>
                <div className={classes.control}>
                    <label htmlFor="email">Your Email</label>
                    <input
                        type="email"
                        id="email"
                        required
                        ref={emailInputRef}
                    />
                </div>
                <div className={classes.control}>
                    <label htmlFor="password">Your Password</label>
                    <input
                        type="password"
                        id="password"
                        required
                        ref={passwordInputRef}
                    />
                </div>
                <div className={classes.actions}>
                    {!isLoading && (
                        <button>{isLogin ? "Login" : "Create Account"}</button>
                    )}
                    {isLoading && (
                        <p style={{ color: "white" }}>Sending request...</p>
                    )}

                    <button
                        type="button"
                        className={classes.toggle}
                        onClick={switchAuthModeHandler}
                    >
                        {isLogin
                            ? "Create new account"
                            : "Login with existing account"}
                    </button>
                </div>
            </form>
        </section>
    );
};
export default AuthForm;
