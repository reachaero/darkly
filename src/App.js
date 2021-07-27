import './App.css';
import React from "react";
import Webcam from "react-webcam";

function App() {
    const webcamRef = React.useRef(null);
    const [imgSrc, setImgSrc] = React.useState(null);
    const capture = React.useCallback(async () => {
        const imgSrc = webcamRef.current.getScreenshot();

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ image: imgSrc })
        };
        if(!imgSrc) { return; };
        const response = await fetch(process.env.REACT_APP_BACKEND_URI + '/doOCR', requestOptions);
        const res = await response.json();
        setOcr(res.text);

    }, [webcamRef]);


    const videoConstraints = {
        // facingMode: 'user',
        facingMode: { exact: 'environment' }
    };

    const [ocr, setOcr] = React.useState('Recognizing...');
        
    return (
        <>
            <Webcam
                class="video"
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
            />
            <div class="bottom-wrapper">
                <div class="scan-button-wrapper">
                    <button class="scan-button" onClick={capture}>Scan</button>
                </div>
                <div class="feedback-wrapper">
                    <p class="feedback">{ocr}</p>
                </div>
            </div>
            {imgSrc && (
                <img
                    src={imgSrc}
                />
            )}
        </>
    );
}

export default App;
