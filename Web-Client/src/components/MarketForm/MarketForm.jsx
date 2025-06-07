import styles from "./MarketForm.module.scss";

import axiosInstance from "@services/axiosInstance";
import { useState, useId } from "react";
import CustomCheckbox from "@components/CustomCheckbox/CustomCheckbox";


export default function MarketForm({ currencyCodes, setCurrencyData, setIsCurrencyDataLoaded }) {
    const baseUniqueId = useId();
    
    const [formData, setFormData] = useState({
        currency: "",
        includeDateRange: false,
        startDate: "",
        endDate: "",
    });

    const [formErrors, setFormErrors] = useState({
        currencyNotSelected: false,
        startDateNotSelected: false,
        endDateNotSelected: false,
    });


    const handleFormInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value}));
    }

    const isFormCompleted = () => {
        let isFormFullyCompleted = true;

        if(formData.currency === "" || formData.currency === null){
            setFormErrors((prev) => ({ ...prev, currencyNotSelected: true}));
            isFormFullyCompleted = false;
        }
        else{
            setFormErrors((prev) => ({ ...prev, currencyNotSelected: false}));
        }

        if(formData.includeDateRange && formData.startDate === ""){
            setFormErrors((prev) => ({ ...prev, startDateNotSelected: true}));
            isFormFullyCompleted = false;
        }
        else{
            setFormErrors((prev) => ({ ...prev, startDateNotSelected: false}));
        }

        if(formData.includeDateRange && formData.endDate === ""){
            setFormErrors((prev) => ({ ...prev, endDateNotSelected: true}));
            isFormFullyCompleted = false;
        }
        else{
            setFormErrors((prev) => ({ ...prev, endDateNotSelected: false}));
        }

        return isFormFullyCompleted;
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        if(isFormCompleted()){
            let endpointURL;
            if(formData.includeDateRange){
                endpointURL = `/currency/range/?startDate=${formData.startDate}&endDate=${formData.endDate}&code=${formData.currency}`;
            }
            else{
                endpointURL = `/currency/?code=${formData.currency}`;
            }

            axiosInstance.get(endpointURL).then(
                response => {
                    setCurrencyData(response.data);
                    setIsCurrencyDataLoaded(true);
                }
            )
            .catch(err => {
                console.error(err);
                setIsCurrencyDataLoaded(true);
            });
        }
    }

    return (
        <form className={styles.currency_form} onSubmit={handleFormSubmit}>
            <div>
                <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleFormInputChange}
                >   
                    <option value="" disabled>Select currency</option>
                    {currencyCodes.map((code) => <option key={code} value={code}>{code}</option>)}
                </select>
                {formErrors.currencyNotSelected && (
                    <div className={styles.form_error_container}>
                        <p>Currency needs to be selected</p>
                    </div>
                )}
            </div>
            

            <CustomCheckbox 
                inputName={"includeDateRange" } 
                labelText={"include date range?"} 
                fontSize={"1rem"}
                onClickAction={handleFormInputChange}
            />
            {formData.includeDateRange && (
                <div className={styles.date_inputs_container}>
                    <div className={styles.single_date_input_container}>
                        <label htmlFor={`${baseUniqueId}-startDate`}>Start Date:</label>
                        <input
                            type="date"
                            name="startDate"
                            id={`${baseUniqueId}-startDate`}
                            value={formData.startDate}
                            onChange={handleFormInputChange}
                        />
                    </div>
                    {formErrors.startDateNotSelected && (
                        <div className={styles.form_error_container}>
                            <p>Start Date needs to be selected</p>
                        </div>
                    )}
                    
                    <div className={styles.single_date_input_container}>
                        <label htmlFor={`${baseUniqueId}-endDate`}>End Date:</label>
                        <input
                            type="date"
                            name="endDate"
                            id={`${baseUniqueId}-endDate`}
                            value={formData.endDate}
                            onChange={handleFormInputChange}
                        />
                    </div>
                    {formErrors.endDateNotSelected && (
                        <div className={styles.form_error_container}>
                            <p>End Date needs to be selected</p>
                        </div>
                    )}
                </div>
            )}

            <button type="submit">Get Currency Rates</button>
        </form>
    );
}