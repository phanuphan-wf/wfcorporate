import React from 'react';
import Axios from 'axios';

export default function SendPixelVis(props) {

    var CryptoJS = require('crypto-js');

    const ph = CryptoJS.SHA256(props.mob).toString();


    let current_timestamp = Math.floor(new Date() / 1000);


    const data = [
        {
            "event_name": 'Visited',
            "event_time": current_timestamp,
            "action_source": "app",
            "event_source_url": "https://app.worldfair.co.th",
            "user_data": {
                "ph": [
                    ph
                ]
            },
            "custom_data": {
                "content_name": "B322"
            }
        }
    ]


    const access_token = process.env.REACT_APP_fb_token;
    const pixel_id = process.env.REACT_APP_fb_pixel;

    async function postPixel() {
        const res = await Axios.post('https://graph.facebook.com/v13.0/' + pixel_id + '/events?access_token=' + access_token, { data });

    }

    postPixel();
}