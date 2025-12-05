import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import authService from "../../../services/auth";
import AuthContext from "../auth/AuthContext";
import type LoginModel from "../../../models/login";
import "../auth-panel/AuthPanel.css"
import useTitle from "../../../hooks/use-title";

export default function Login() {

    useTitle('Login')

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<LoginModel>();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    async function submit(model: LoginModel) {
        try {
            setIsSubmitting(true);

            const { jwt } = await authService.login(model);
            authContext?.newJwt(jwt);

            const payload = JSON.parse(atob(jwt.split(".")[1]));
            const role = payload.role;

            if (role === "admin") navigate("/admin");
            else navigate("/vacations");

        } catch(e) {
            setError("root", { message: "Email or password is incorrect" });
            console.log(e)
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="AuthFormWrapper">
            <div className="AuthCard">
                <h2>Login</h2>

                {errors.root && (
                    <div className="error-box">{errors.root.message}</div>
                )}

                <form onSubmit={handleSubmit(submit)}>

                    <input
                        placeholder="email"
                        {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && (
                        <div className="error-box">{errors.email.message}</div>
                    )}

                    <input
                        placeholder="password"
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Minimum 6 characters" }
                        })}
                    />
                    {errors.password && (
                        <div className="error-box">{errors.password.message}</div>
                    )}

                    <button disabled={isSubmitting}>Login</button>
                </form>

                <div className="SwitchText">
                    don't have account? <NavLink to="/auth/signup">register now</NavLink>
                </div>
            </div>
        </div>
    );
}
