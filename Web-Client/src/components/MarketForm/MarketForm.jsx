import styles from "./MarketForm.module.scss";

import axiosInstance from "@services/axiosInstance";
import { useState, useId } from "react";
import CustomCheckbox from "@components/CustomCheckbox/CustomCheckbox";


export default function MarketForm({ 
        currencyCodes, 
        setCurrencyData, 
        setLoadingCurrencyData, 
        setLoadingErrors, 
        setHasUserStartedLoadingCurrencyData,
        setCurrencyDataType
    }) {
    const baseUniqueId = useId();
    
    const [formData, setFormData] = useState({
        dataType: "currency", // "currency" | "gold"
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

        if(formData.dataType === "currency" && (formData.currency === "" || formData.currency === null)){
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
            setLoadingCurrencyData(true);
            setHasUserStartedLoadingCurrencyData(false);

            let endpointURL;
            if(formData.dataType === "currency"){
                if(formData.includeDateRange){
                    endpointURL = `/currency/range/?startDate=${formData.startDate}&endDate=${formData.endDate}&code=${formData.currency}`;
                }
                else{
                    endpointURL = `/currency/?code=${formData.currency}`;
                }
            }
            else if(formData.dataType === "gold"){
                if(formData.includeDateRange){
                    endpointURL = `/currency/gold/range/?startDate=${formData.startDate}&endDate=${formData.endDate}`;
                }
                else{
                    endpointURL = `/currency/gold/`;
                }
            }
            else{
                console.error("Unknown dataType passed from MarketForm (should be gold or currency)");
                //TODO EXIT
            }

            axiosInstance.get(endpointURL).then(
                response => {
                    setCurrencyData(response.data);
                    setCurrencyDataType(formData.dataType);
                    setLoadingErrors((prev) => ({ ...prev, loadingCurrencyDataError: null}));
                    setLoadingCurrencyData(false);
                    setHasUserStartedLoadingCurrencyData(true);
                }
            )
            .catch(err => {
                console.error(err);
                setLoadingErrors((prev) => ({ 
                    ...prev, 
                    loadingCurrencyDataError: "failed to load data about selected currency, please try again later" 
                }))
                setLoadingCurrencyData(false);
                setHasUserStartedLoadingCurrencyData(true);
            });
        }
    }


    return (
        <form className={styles.currency_form} onSubmit={handleFormSubmit}>
            <div className={styles.currency_radio_input_type_container}>
                <div className={styles.currency_single_radio_input_type_container}>
                    <input
                        type="radio"
                        name="dataType"
                        id={`${baseUniqueId}-currency`}
                        value="currency"
                        checked={formData.dataType === "currency"}
                        onChange={handleFormInputChange}
                    />
                    <label htmlFor={`${baseUniqueId}-currency`}>Currency</label>
                </div>
                <div className={styles.currency_single_radio_input_type_container}>
                    <input
                        type="radio"
                        name="dataType"
                        id={`${baseUniqueId}-gold`}
                        value="gold"
                        checked={formData.dataType === "gold"}
                        onChange={handleFormInputChange}
                    />
                    <label htmlFor={`${baseUniqueId}-gold`}>Gold</label>
                </div>
            </div>

            {formData.dataType === "currency" && (
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
            )}
            
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

            <button type="submit">
                {formData.dataType === "currency" ? "Get Currency Rates" : "Get Gold Price"}
            </button>
        </form>
    );
}