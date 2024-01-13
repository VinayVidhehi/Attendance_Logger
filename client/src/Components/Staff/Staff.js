import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import PerformOCR from '../Body/OCR';
import axios from 'axios';

const Staff = () => {

    const [isCounsellor, setIsCounsellor] = useState(false);
    const location = useLocation();
    const email = location.state.email;
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:7800/attendance-staffview?email=${email}`);
      
            if (response.data.key === 1) {
              setIsCounsellor(true);
            } else {
              console.log('Invalid response structure or key value:', response.data);
            }
          } catch (error) {
            console.error('Error fetching attendance staff view:', error.message);
          }
        };
      
        fetchData();
      }, [email, setIsCounsellor]);
      
  return (
    <div>
        <div>
            <h2>Welcome to AMS</h2>
        </div>
        <div> 
           {isCounsellor &&  <PerformOCR />}
        </div>
    </div>
  )
}

export default Staff