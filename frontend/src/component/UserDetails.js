import React, {useState} from 'react';
import {toast} from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';
import {useSelector} from "react-redux";
import axios from 'axios';

const UserDetails = () => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [foodPreference, setFoodPreference] = useState('veg');
    const navigate = useNavigate();

    const userData = useSelector((state) => state.user);

    const handleHeightChange = (event) => {
        setHeight(event.target.value);
    };

    const handleWeightChange = (event) => {
        setWeight(event.target.value);
    };

    const handleFoodPreferenceChange = (event) => {
        setFoodPreference(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const bmi = (weight / ((height / 100) ** 2)).toFixed(2);

        if (isNaN(bmi) || height <= 0 || weight <= 0) {
            toast.error('Please enter valid height and weight.');
            return;
        }

        if (bmi < 18.5) {
            toast.error('Your BMI: ' + bmi + ' suggests you are underweight. Consider consulting a healthcare professional.');
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            toast.success('Your BMI: ' + bmi + ' indicates you have a healthy weight. Keep up the good work!');
        } else if (bmi >= 25) {
            toast.error('Your BMI: ' + bmi + ' suggests you are overweight. Consider consulting a healthcare professional.');
        }

        try {
            const data = {
                email: userData.email,
                bmi,
                foodPreference
            }
            const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/userdetails`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            })

            console.log(response.data);
        } catch (err) {
            console.error(err);
            toast.error('Error submitting user details. Please try again.');
        }

        navigate('/');
    };

    return (
        <form onSubmit={handleSubmit} style={{maxWidth: '400px', margin: '0 auto', padding: '40px 20px'}}>
            <h2 style={{textAlign: 'center', marginBottom: '40px'}}>Enter Your Details</h2>

            <div>
                <label htmlFor="height">Height in cm:</label>
                <input
                    type="number"
                    id="height"
                    value={height}
                    onChange={handleHeightChange}
                    placeholder="Enter your height"
                    style={{width: '100%', padding: '10px', margin: '10px 0'}}
                />
            </div>

            <div>
                <label htmlFor="weight">Weight in kg:</label>
                <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={handleWeightChange}
                    placeholder="Enter your weight"
                    style={{width: '100%', padding: '10px', margin: '10px 0'}}
                />
            </div>

            <div>
                <label htmlFor="foodPreference">Food Preference:</label>
                <select
                    id="foodPreference"
                    value={foodPreference}
                    onChange={handleFoodPreferenceChange}
                    style={{width: '100%', padding: '10px', margin: '10px 0'}}
                >
                    <option value="veg">Vegetarian</option>
                    <option value="non_veg">Non-Vegetarian</option>
                </select>
            </div>

            <input type="submit" value="Submit" style={{
                width: '100%',
                padding: '10px',
                marginTop: '20px',
                backgroundColor: 'green',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
            }}/>
        </form>
    );
};

export default UserDetails;
