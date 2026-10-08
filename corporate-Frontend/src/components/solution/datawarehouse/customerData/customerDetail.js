import React, {useContext, useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";

export default function CustomerDetail() {

    const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cdp;
    const bearer = useHeader();
    const { id } = useParams();


    useEffect(() => {
        console.log("Customer ID:", id);
    }, [id]);

    return (
        <section> 
            <h6 className="mt-4">Customer Detail</h6>
        </section>
    );
}