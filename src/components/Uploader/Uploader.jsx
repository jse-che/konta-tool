import React, { useRef, useState } from 'react';
import JSZip from 'jszip';
import { Button } from '@mui/material';
import { utils, write } from 'xlsx';
import UploadBox from '../UploadBox/UploadBox';
import DataTable from '../DataTable/DataTable';

function Uploader() {
  const inputFileRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);

  const processFiles = (files) => {
    const zipFiles = Array.from(files).filter(file => file.name.endsWith('.zip'));
    if (zipFiles.length > 0) {
      const filePromises = zipFiles.map(zipFile => {
        return JSZip.loadAsync(zipFile).then(zip => {
          const xmlPromises = [];
          zip.forEach((relativePath, file) => {
            if (file.name.endsWith('.xml')) {
              xmlPromises.push(file.async('text').then(xmlContent => {
                processXML(xmlContent, file.name);
              }));
            }
          });
          return Promise.all(xmlPromises);
        });
      });

      Promise.all(filePromises).then(() => {
        setIsUploaded(true);
      });
    }
  };

  const processXML = (xmlContent, fileName) => {
    const parser = new DOMParser();
    const docXML = parser.parseFromString(xmlContent, "application/xml");

    const descriptionElement = docXML.getElementsByTagName("cbc:Description")[0];
    if (!descriptionElement) {
      console.error("El elemento cbc:Description no se encontró en el XML.");
      return;
    }

    const cdataContent = descriptionElement.textContent;
    const innerDoc = parser.parseFromString(cdataContent, "application/xml");

    const getElementTextContent = (doc, tagName, defaultValue) => {
      const element = doc.getElementsByTagName(tagName)[0];
      return element ? element.textContent : defaultValue;
    };

    const formatDate = (dateString) => {
      if (dateString === "N/A") return dateString;
      const dateParts = dateString.split("-");
      if (dateParts.length === 3) {
        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
      return dateString;
    };

    const issueDate = formatDate(getElementTextContent(innerDoc, "cbc:IssueDate", "N/A"));
    const parentDocumentID = getElementTextContent(innerDoc, "cbc:ID", "N/A");
    const taxableAmount = parseFloat(getElementTextContent(innerDoc, "cbc:LineExtensionAmount", "0.00"));
    const taxAmount = parseFloat(getElementTextContent(innerDoc, "cbc:TaxAmount", "0.00"));
    const payableAmount = parseFloat(getElementTextContent(innerDoc, "cbc:PayableAmount", "0.00"));
    const cufe = getElementTextContent(innerDoc, "cbc:UUID", "N/A");

    const senderParty = innerDoc.getElementsByTagName("cac:AccountingSupplierParty")[0];
    const registrationName = senderParty ? getElementTextContent(senderParty, "cbc:RegistrationName", "N/A") : "N/A";
    const companyID = senderParty ? getElementTextContent(senderParty, "cbc:CompanyID", "N/A") : "N/A";

    const xmlFileNameWithoutExtension = fileName.split("/").pop().replace(".xml", "");

    setTableData(prevData => [
      ...prevData,
      [issueDate, parentDocumentID, registrationName, companyID, taxableAmount, taxAmount, payableAmount, xmlFileNameWithoutExtension]
    ]);
  };

  const downloadFiles = async () => {
    const zip = new JSZip();

    const xmlFolder = zip.folder('xml');
    const pdfFolder = zip.folder('pdf');

    tableData.forEach(row => {
      const xmlFileName = `${row[7]}.xml`;
      const pdfFileName = `${row[7]}.pdf`;
      xmlFolder.file(xmlFileName, 'This is a sample XML file content.');
      pdfFolder.file(pdfFileName, 'This is a sample PDF file content.');
    });


    const ws = utils.json_to_sheet(tableData, {
      header: ["Fecha", "No. Factura", "Empresa", "Nit", "SubTotal", "IVAo", "Total", "Nombre Factura"]
    });
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');

    const excelContent = write(wb, { type: 'array', bookType: 'xlsx' });

    zip.file('data.xlsx', excelContent);

    zip.generateAsync({ type: 'blob' }).then(content => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = 'files.zip';
      a.click();
    }).catch(err => {
      console.error('Error generating ZIP file:', err);
    });
  };

  return (
    <div className='mainUploader'>
      {!isUploaded ? (
        <UploadBox 
          inputFileRef={inputFileRef} 
          onFilesDrop={processFiles}
          onFilesSelect={(e) => e.target.files && processFiles(e.target.files)}
        />
      ) : (
        <div>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={downloadFiles} 
            style={{ marginBottom: '20px' }}
          >
            Descargar archivos
          </Button>
          <DataTable data={tableData} />
        </div>
      )}
    </div>
  );
}

export default Uploader;
