import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AttendanceStaffView = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [attendanceDates, setAttendanceDates] = useState([]);
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.attendance) {
            const attendance = location.state.attendance;
            if (attendance.students && attendance.attendanceString) {
                setAttendanceData(attendance.students);
                setAttendanceDates(attendance.attendanceString);
            }
        }
    }, [location.state]);

    return (
        <div>
            <h2>Attendance</h2>
            <table>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        {attendanceDates.map((item, index) => (
                            <th key={index}>{new Date(item.date).toLocaleDateString()}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {attendanceData.map((student, index) => (
                        <tr key={index}>
                            <td>{student.student_id}</td>
                            <td>{student.student_name}</td>
                            {attendanceDates.map((item, idx) => (
                                <td key={idx}>
                                    {item.attendance[index] === '0' ? 'Absent' : 
                                     item.attendance[index] === '1' ? 'Present' : 'Class not taken'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceStaffView;
