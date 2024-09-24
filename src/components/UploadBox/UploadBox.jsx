/* eslint-disable react/prop-types */
import React from 'react';
import { MdCloudUpload } from 'react-icons/md';
import './UploaderBox.css';

const UploadBox = ({ inputFileRef, onFilesDrop, onFilesSelect }) => {
  const [dragging, setDragging] = React.useState(false);

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
      onFilesDrop(files);
    }
  };

  return (
    <div
      className={`uploaderBox ${dragging ? 'dragging' : ''}`}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <form>
        <input
          type="file"
          accept=".pdf, .zip, .xml, .xlsx"
          ref={inputFileRef}
          className="input-field"
          hidden
          multiple
          onChange={onFilesSelect}
        />
        <MdCloudUpload className="icon" />
        <p>Carga o arrastra tus archivos</p>
        <p>XML, ZIP</p>
      </form>
    </div>
  );
};

export default UploadBox;