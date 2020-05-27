import React, { useState } from "react";
import { Error } from "./error";
import { LoginMutation } from "./mutations/Login";
import { SignUpMutation } from "./mutations/SignUp";

const LoginForm = ({ login, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (event) => {
    event.preventDefault();
    login({ variables: { email, password } });
  };

  return (
    <div className="login">
      <form onSubmit={submit}>
        <label>Email</label>
        <input type="text" onChange={(event) => setEmail(event.target.value)} />
        <label>Password</label>
        <input
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <input type="submit" value="Login" />
      </form>
      {error && (
        <Error>
          <p>There was an error logging in!</p>
        </Error>
      )}
    </div>
  );
};

const RegisterForm = ({ signup, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const submit = (event) => {
    event.preventDefault();
    signup({ variables: { email, password, username } });
  };

  return (
    <div className="login">
      <form onSubmit={submit}>
        <label>Email</label>
        <input type="text" onChange={(event) => setEmail(event.target.value)} />
        <label>Username</label>
        <input
          type="text"
          onChange={(event) => setUsername(event.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <input type="submit" value="Sign up" />
      </form>
      {error && (
        <Error>
          <p>There was an error logging in!</p>
        </Error>
      )}
    </div>
  );
};

export const LoginRegisterForm = ({ changeLoginState }) => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="authModal">
      {showLogin && (
        <div>
          <LoginMutation changeLoginState={changeLoginState}>
            <LoginForm />
          </LoginMutation>
          <a onClick={() => setShowLogin(false)}>Want to sign up? Click here</a>
        </div>
      )}
      {!showLogin && (
        <div>
          <SignUpMutation changeLoginState={changeLoginState}>
            <RegisterForm />
          </SignUpMutation>
          <a onClick={() => setShowLogin(true)}>Want to login? Click here</a>
        </div>
      )}
    </div>
  );
};
