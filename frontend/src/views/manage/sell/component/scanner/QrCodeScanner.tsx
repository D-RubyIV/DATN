import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

type IProps = {
  isScanning: boolean;
  setIsScanning: React.Dispatch<React.SetStateAction<boolean>>;
};

const QrCodeScanner: React.FC<IProps> = ({ isScanning, setIsScanning }) => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const qrRegionId = "qr-reader";

  useEffect(() => {
    console.log("scanResult: ", scanResult)
  }, [scanResult])

  useEffect(() => {
    let html5QrCodeScanner: Html5QrcodeScanner | null = null;

    if (isScanning && document.getElementById(qrRegionId)) {
      html5QrCodeScanner = new Html5QrcodeScanner(
        qrRegionId,
        {
          fps: 10,
          qrbox: { width: 900, height: 900 },
          useBarCodeDetectorIfSupported: true,
          showZoomSliderIfSupported: true,
          defaultZoomValueIfSupported: 5,
        },
        false
      );

      html5QrCodeScanner.render(
        (decodedText) => {
          console.log(`Mã QR đã quét: ${decodedText}`);
          setScanResult(decodedText);
          setIsScanning(false);
        },
        (error) => {
          console.warn(`Quét thất bại: ${error}`);
        }
      );
    }

    return () => {
      if (html5QrCodeScanner) {
        html5QrCodeScanner.clear();
      }
    };
  }, [isScanning]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {isScanning && (
        <div
          className="scan-modal"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            height: "500px",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            zIndex: 1000,
          }}
        >
          <div id={qrRegionId} style={{ width: "100%", height: "100%" }}></div>
          <button
            onClick={() => setIsScanning(false)}
            style={{ marginTop: "20px", padding: "10px 20px" }}
          >
            Dừng Quét
          </button>
        </div>
      )}
    </div>
  );
};

export default QrCodeScanner;