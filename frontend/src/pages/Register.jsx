import React, {use, useState} from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function Home() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username:"",
        email:"",
        password1:"",
        password2:"",
    });


    //wpisywanie danych do formularza rejestracji
    const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
        console.log(formData)
    }

    //blokowanie przycisku rejestracji dopoki obsluga klikniecia sie nie skonczy
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);

    //obsluga rejestracji
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(isLoading){
            return
        }

        setIsLoading(true);

        try{
            const response = await axios.post("http://127.0.0.1:8000/api/register/", formData)
            console.log("Rejestracja udana!", response.data)

            const { access, refresh } = response.data.tokens;
            localStorage.setItem("accessToken", response.data.tokens.access);
            localStorage.setItem("refreshToken", response.data.tokens.refresh);

            //Przejscie do strony glownej po udanej rejestracji
            navigate("/");
        }
        catch(error){
            console.log("Błąd rejestracji!", error.response?.data)
            if(error.response && error.response.data){
                Object.keys(error.response.data).forEach(field => {
                    const errorMessages = error.response.data[field];
                    if(errorMessages && errorMessages.length > 0){
                        setError(errorMessages[0]);
                    }
                })
            }
        }
        finally{
            setIsLoading(false)
        }
    }


    return (
        <div className="form-container">
            {error && <p style={{color:"red"}}>{error}</p>}
            {successMessage && <p style={{color:"green"}}>{successMessage}</p>}
            <h2>Register</h2>
            <label>username</label><br/>
            <input type="text" name="username" value={formData.username} onChange={handleChange}></input> <br/>
            <label>email</label><br/>
            <input type="email" name="email" value={formData.email} onChange={handleChange}></input> <br/>
            <label>password</label><br/>
            <input type="password" name="password1" value={formData.password1} onChange={handleChange}></input> <br/>
            <label>confirm password:</label><br/>
            <input type="password" name="password2" value={formData.password2} onChange={handleChange}></input> <br/>
            <br/>
            <button type="submit" disabled={isLoading} onClick={handleSubmit}>
                Register
            </button>
            <p>
                Masz już konto? <Link to="/login" className="text-blue-500 hover:underline">Zaloguj się</Link>
            </p>


        </div>
    );
}