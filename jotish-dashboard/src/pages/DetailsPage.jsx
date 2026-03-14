import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEmployees } from "../context/EmployeeContext";
import { mergeCanvases } from "../utils/mergeImages";
import styles from "../styles/details.module.css";

export default function DetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { employees } = useEmployees();

  // Load employee data - fallback to state if direct navigation without employees loaded
  const employee = location.state || employees.find(e => String(e.id) === id);

  const videoRef = useRef(null);
  const photoCanvasRef = useRef(null);
  const sigCanvasRef = useRef(null);
  const streamRef = useRef(null);
  const isDrawing = useRef(false);

  const [cameraActive, setCameraActive] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);

  // Cleanup camera unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Setup signature canvas specifically when photo is taken
  useEffect(() => {
    if (photoTaken && photoCanvasRef.current && sigCanvasRef.current) {
      sigCanvasRef.current.width  = photoCanvasRef.current.width;
      sigCanvasRef.current.height = photoCanvasRef.current.height;
      const ctx = sigCanvasRef.current.getContext("2d");
      ctx.strokeStyle = "#1a1aff";
      ctx.lineWidth   = 2;
      ctx.lineCap     = "round";
      ctx.lineJoin    = "round";
    }
  }, [photoTaken]);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Failed to access camera: " + err.message);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !photoCanvasRef.current) return;
    const canvas = photoCanvasRef.current;
    canvas.width  = videoRef.current.videoWidth;  // native res, not CSS size
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    
    setCameraActive(false);
    setPhotoTaken(true);
  };

  const getScaledPos = (e) => {
    const canvas = sigCanvasRef.current;
    const rect   = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width  / rect.width),
      y: (e.clientY - rect.top)  * (canvas.height / rect.height)
    };
  };

  const handlePointerDown = (e) => {
    isDrawing.current = true;
    const { x, y } = getScaledPos(e);
    const ctx = sigCanvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current) return;
    const { x, y } = getScaledPos(e);
    const ctx = sigCanvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUpOrLeave = () => {
    isDrawing.current = false;
  };

  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveAndVerify = () => {
    const auditImg = mergeCanvases(photoCanvasRef.current, sigCanvasRef.current);
    localStorage.setItem(`audit_${id}`, auditImg);
    navigate("/analytics", { state: { auditImage: auditImg, employeeId: id } });
  };

  if (!employee && employees.length === 0) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (!employee) {
    return <div className={styles.container}>Employee not found.</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Employee Details</h2>
      
      <div className={styles.details}>
        <p><strong>ID:</strong> {employee.id}</p>
        <p><strong>Name:</strong> {employee.name}</p>
        <p><strong>City:</strong> {employee.city}</p>
        <p><strong>Salary:</strong> {employee.salary}</p>
      </div>

      <div className={styles.cameraSection}>
        {!cameraActive && !photoTaken && (
          <button onClick={openCamera} className={styles.button}>Open Camera</button>
        )}

        <div className={styles.videoContainer} style={{ display: cameraActive ? "block" : "none" }}>
          <video ref={videoRef} autoPlay playsInline muted className={styles.video} />
          <br />
          <button onClick={capturePhoto} className={styles.button} style={{ marginTop: '10px' }}>
            Capture Photo
          </button>
        </div>

        <canvas ref={photoCanvasRef} style={{ display: "none" }} />

        {photoTaken && (
          <div>
            <h3>Sign below to verify identity</h3>
            <div className={styles.captureArea}>
              <img 
                src={photoCanvasRef.current?.toDataURL()} 
                alt="Captured profile" 
                className={styles.video} 
                style={{ display: "block" }} 
              />
              <canvas
                ref={sigCanvasRef}
                className={`${styles.sigCanvas} ${styles.video}`} // inherit width/max-width to overlay correctly
                style={{ position: 'absolute', top: 0, left: 0, height: '100%' }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUpOrLeave}
                onPointerLeave={handlePointerUpOrLeave}
              />
            </div>
            
            <div className={styles.actions}>
              <button onClick={clearSignature} className={styles.button}>Clear Signature</button>
              <button onClick={saveAndVerify} className={styles.button} style={{ background: '#10b981' }}>Save & Verify</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
