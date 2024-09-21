/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import JSZip from 'jszip';
import { Button, Container, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { utils, write } from 'xlsx';

import UploadBox from '../UploadBox/UploadBox';
import DataTable from '../DataTable/DataTable';
import SearchBar from '../Search/Search';
import './Uploader.css';

function Uploader() {
  const inputFileRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const fileMap = useRef(new Map());

  const processFiles = (files) => {
    const zipFiles = Array.from(files).filter(file => file.name.endsWith('.zip'));
    if (zipFiles.length > 0) {
      const filePromises = zipFiles.map(zipFile => {
        return JSZip.loadAsync(zipFile).then(zip => processZipFile(zip));
      });

      Promise.all(filePromises).then(() => {
        setIsUploaded(true);
      });
    }
  };

  const processZipFile = (zip) => {
    const filePromises = [];

    zip.forEach((relativePath, file) => {
      if (file.name.endsWith('.zip')) {
        filePromises.push(
          file.async('blob').then(blob => JSZip.loadAsync(blob)).then(innerZip => {
            return processZipFile(innerZip);
          })
        );
      } else if (file.name.endsWith('.xml') || file.name.endsWith('.pdf')) {
        fileMap.current.set(file.name, file);

        if (file.name.endsWith('.xml')) {
          filePromises.push(
            file.async('text').then(xmlContent => {
              processXML(xmlContent, file.name);
            })
          );
        }
      }
    });

    return Promise.all(filePromises);
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
  
    const referenceEventCode = getElementTextContent(innerDoc, "cbc:ReferenceEventCode", "N/A");
  
    const getPaymentType = (code) => {
      switch (code) {
        case '2':
          return 'Credito';
        case '1':
          return 'Contado';
        case '0':
          return 'Inmediato';
        default:
          return 'N/A ';
      }
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
      }).format(value);
    };
  
    const paymentType = getPaymentType(referenceEventCode);
  
    const xmlFileNameWithoutExtension = fileName.split("/").pop().replace(".xml", "");
    const cleanFileName = xmlFileNameWithoutExtension.startsWith("XML_")
      ? xmlFileNameWithoutExtension.substring(4)
      : xmlFileNameWithoutExtension;
  
      const newRow = [
        issueDate,           
        parentDocumentID,    
        registrationName,    
        companyID,           
        taxableAmount,      
        taxAmount,           
        payableAmount,      
        paymentType,         
        cleanFileName,       
        cufe                  
      ];
  
    setTableData(prevData => {
      const updatedData = [...prevData, newRow];
      setFilteredData(updatedData);
      return updatedData;
    });
  };

  const downloadFiles = async () => {
    const zip = new JSZip();

    const xmlFolder = zip.folder('XMLs');
    const pdfFolder = zip.folder('PDFs');

    const filePromises = [];

    fileMap.current.forEach((file, fileName) => {
      console.log(`Processing file: ${fileName}`);

      if (fileName.endsWith('.xml')) {
        const xmlFileName = fileName.split('/').pop();
        const xmlPromise = file.async('blob').then(content => {
          xmlFolder.file(xmlFileName, content);
        });
        filePromises.push(xmlPromise);
      } else if (fileName.endsWith('.pdf')) {
        const pdfFileName = fileName.split('/').pop();
        const pdfPromise = file.async('blob').then(content => {
          pdfFolder.file(pdfFileName, content);
        });
        filePromises.push(pdfPromise);
      }
    });

    Promise.all(filePromises).then(() => {
      const ws = utils.json_to_sheet(
        tableData.map(row => ({
          Fecha: row[0],
          'No. Factura': row[1],
          Empresa: row[2],
          Nit: row[3],
          SubTotal: row[4],
          IVA: row[5],
          Total: row[6],
          'Medio Pago': row[7],  
          'Nombre Factura': row[8],  
          CUFE: row[9]
        })),
        { header: ["Fecha", "No. Factura", "Empresa", "Nit", "SubTotal", "IVA", "Total", "Medio Pago", "Nombre Factura", "CUFE"] }
      );
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Resumen');

      const excelContent = write(wb, { type: 'array', bookType: 'xlsx' });

      zip.file('Resumen.xlsx', excelContent);

      zip.generateAsync({ type: 'blob' }).then(content => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = 'Archivos.zip';
        a.click();
      }).catch(err => {
        console.error('Error generating ZIP file:', err);
      });
    }).catch(err => {
      console.error('Error processing files:', err);
    });
  };

  const handleSearch = (searchValue) => {
    const filtered = tableData.filter(row => {
      return row.some(value => value.toString().toLowerCase().includes(searchValue.toLowerCase()));
    });
    setFilteredData(filtered);
  };

  return (
    <Container style={{ padding: '20px', width: '100%', maxWidth: '1200px' }}>
      {!isUploaded ? (
        <UploadBox 
          inputFileRef={inputFileRef} 
          onFilesDrop={processFiles}
          onFilesSelect={(e) => e.target.files && processFiles(e.target.files)}
        />
      ) : (
        <div>
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            style={{ marginBottom: '20px' }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={downloadFiles}
              className="download-button"
            >
              <DownloadIcon className="download-icon" /> 
              Descargar archivos
            </Button>
            <SearchBar onSearch={handleSearch} />
          </Box>
          <DataTable data={filteredData.map(row => row.slice(0, -2))} />
        </div>
      )}
    </Container>
  );
}

export default Uploader;