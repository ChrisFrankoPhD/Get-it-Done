import { useState } from "react";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

const Login = ({ setAuth }) => {
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });
    const updateInputs = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value});
    };

    const onSubmitForm = async (e) => {
        e.preventDefault()
        try {
            const body = { ...inputs }
            const response = await fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            const data = await response.json()
            console.log(data);
            if (data.token) {
                localStorage.setItem("token", data.token)
                setAuth(true)

                toast.success("Login Successful")
            } else {
                console.log("log in no bueno");
                setAuth(false)
                toast.error(data)
            }
            
        } catch (error) {
            console.error(error.message);
        }
    }
    return (
        <>
            <div className="container">
                <div className="row text-center mt-5">
                    <h1>Login</h1>
                    <form onSubmit={onSubmitForm} className="w-100 mt-3 d-flex flex-column justify-content-center align-items-center">
                        <input value={inputs.email} onChange={updateInputs} className="w-50 form-control d-flex justify-content-center border border-1 border-secondary-subtle mb-3" type="email" name="email" placeholder="Email Address" />
                        <input value={inputs.password} onChange={updateInputs} className="w-50 form-control d-flex justify-content-center border border-1 border-secondary-subtle mb-3" type="password" name="password" placeholder="Password" />
                        <button className="w-50 btn btn-success btn-block mb-3">Submit</button>
                    </form>
                    <Link to="/register">Or Create a New Account</Link>
                </div>
            </div>
        </>
    );
};

export default Login;