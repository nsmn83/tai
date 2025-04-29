import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Login() {
        const navigate = useNavigate();
        const [formData, setFormData] = useState({
            email:"",
            password:"",
        });

   //wpisywanie danych do formularza logowania
   const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
    };
   //blokowanie przycisku logowania dopoki obsluga klikniecia sie nie skonczy
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);

    //obsluga logowania
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(isLoading){
            return
        }

        setIsLoading(true);

        try{
            const response = await axios.post("http://127.0.0.1:8000/api/login/", formData)
            console.log("Logowanie udane!", response.data)
            setSuccessMessage("Logowanie udane!");
            localStorage.setItem("accessToken", response.data.tokens.access);
            localStorage.setItem("refreshToken", response.data.tokens.refresh);

            //Przejscie do strony glownej po udanym logowaniu
            navigate("/");
        }
        catch(error){
            console.log("Błąd logowania!", error.response?.data)
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
            <h2>Login</h2>
            <input 
              placeholder='Wprowadź e-mail'
            type="email" name="email" value={formData.email} onChange={handleChange}></input> <br/>
            <input 
            placeholder='Wprowadź hasło'
            type="password" name="password" value={formData.password} onChange={handleChange}></input> <br/>
            <br/>
            <button type="submit" disabled={isLoading} onClick={handleSubmit}>
                Login
                </button>


        </div>
    )
}