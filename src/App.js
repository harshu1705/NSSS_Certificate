import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import Papa from 'papaparse';
import Swal from 'sweetalert2';

const App = () => {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);

  // Load users from a CSV file on component mount
  React.useEffect(() => {
    fetch('/participants.csv') // Make sure your CSV file is in the public folder
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          complete: (result) => {
            setUsers(result.data.map((row) => row[0].trim().toLowerCase())); // Assuming names are in the first column
          }
        });
      });
  }, []);

  const handleDownload = () => {
    const userName = name.trim().toLowerCase();

    if (userName && users.includes(userName)) {
      const img = new Image();
      img.src = '/certificate_template.png';

      img.onload = () => {
        const doc = new jsPDF('landscape', 'px', 'a4');
        doc.addImage(img, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

        // Set font to bold and larger size for certificate styling
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(32);

        // Calculate the width of the name and center it
        const textWidth = doc.getTextWidth(name);
        const pageWidth = doc.internal.pageSize.getWidth();
        const xPosition = (pageWidth - textWidth) / 2;

        // Add the name in the center of the certificate
        doc.text(name, xPosition, 250); // Adjust the y-coordinate as needed

        // Save the PDF with the certificate format
        doc.save(`${name}-certificate.pdf`);
      };
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Name not found',
        text: 'Sorry, your name was not found in the records .',
        confirmButtonText: 'OK',
        position: 'center'
      });
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundImage: 'url(nss1.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      flexDirection: 'column',
      color: '#fff',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
    }}>
      <h1 style={{
        fontSize: '48px',
        marginBottom: '30px',
        transition: 'transform 0.3s',
        transform: 'scale(1)',
        textAlign: 'center'
      }}>Stem Cell Donation Drive Certificate</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        style={{
          padding: '15px',
          width: '350px',
          fontSize: '18px',
          borderRadius: '5px',
          border: '1px solid #ddd',
          marginBottom: '20px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s',
          outline: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#333'
        }}
        onFocus={(e) => e.target.style.boxShadow = '0px 0px 10px rgba(0, 123, 255, 0.5)'}
        onBlur={(e) => e.target.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)'}
      />
      <button onClick={handleDownload} style={{
        padding: '15px 30px',
        fontSize: '18px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s, transform 0.3s'
      }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#0056b3';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = '#007BFF';
          e.target.style.transform = 'scale(1)';
        }}>
        Get your  Certificate
      </button>
    </div>
  );
};

export default App;
