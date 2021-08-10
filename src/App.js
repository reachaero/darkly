import './App.css';
import React from "react";
import Webcam from "react-webcam";
import Barcode from "react-barcode";

function App() {
    const webcamRef = React.useRef(null);
    const [imgSrc, setImgSrc] = React.useState(null);
    const [name, setName] = React.useState(null);
    const [barcode, setBarcode] = React.useState(null);
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
        setName(res.name_de);
        setBarcode(res.nummer);
        setOcr(res.ocr);

    }, [webcamRef]);


    const videoConstraints = {
        //facingMode: 'user',
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
                    <p class="feedback">{name}</p>
                    <p class="feedback">{ocr}</p>
                    <p class="feedback">{barcode}</p>
                    {barcode && (
                        <Barcode
                            value={barcode}
                        />
                    )}
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
