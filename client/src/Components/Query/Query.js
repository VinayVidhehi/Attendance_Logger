import React, { useState } from 'react';
import axios from 'axios';

const Query = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    try {
      // Send POST request to endpoint with query
      const response = await axios.post('http://localhost:7800/query', { query });
      const responseData = response.data;

      // Set result state based on response data
      setResult(responseData.result);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error
    }
  };

  
  const renderResultUnmodified = () => {
    return (
      <div>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  };
  

  const renderResult = () => {
    if (Array.isArray(result) && result.length > 0 && typeof result[0] === 'object') {
      // If result is an array of objects, render as a table
      return (
        <table>
          <thead>
            <tr>
              {Object.keys(result[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      // Otherwise, render as JSON string
      return <pre>{JSON.stringify(result, null, 2)}</pre>;
    }
  };

  return (
    <div>
      <h2>Query</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={5}
        cols={50}
        placeholder="Enter your query here..."
      />
      <br />
      <button style={{paddingRight:15, paddingLeft:15, paddingBottom:2, paddingTop:2, margin:10, borderRadius:10, backgroundColor:"navy"}} onClick={handleSubmit}>Submit Query</button>
      <div>
        <h3>Result:</h3>
       {/*  {renderResult()}*/}

      {renderResultUnmodified()} 
      </div>
     
    </div>
  );
};

export default Query;
