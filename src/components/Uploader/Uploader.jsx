import './Uploader.css';
import { MdCloudUpload } from 'react-icons/md';
import { useRef, useState } from 'react';

function Uploader() {
  const inputFileRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleClick = () => {
    inputFileRef.current.click();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      inputFileRef.current.files = files;
      console.log('Archivos arrastrados:', files);
    }
  };

  return (
    <div className='mainUploader'>
      <div 
        className={`uploaderBox ${dragging ? 'dragging' : ''}`} 
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="titleUpload">
            <h1 className='title'>Sube tus facturas electronicas</h1>
        </div>
        <form>
          <input 
            type="file" 
            accept=".pdf, .zip, .xml, .xlsx" 
            ref={inputFileRef}
            className="input-field" 
            hidden
          />
          <MdCloudUpload className="icon" />
          <p>Carga o arrastra tus archivos</p>
          <p>PDF, XML, XLSX</p>
        </form>
      </div>
    </div>
  );
}

export default Uploader;