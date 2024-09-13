import React from 'react';
import styled from 'styled-components';
import StaffTableStaff from "./component1/StaffTable";
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook

// Define a styled button component
const StyledButton = styled.button`
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;  // Optional: for rounded corners
    margin-bottom: 10px;

    &:hover {
        background-color: #0056b3;
    }
`;

// Define a container for better spacing
const Container = styled.div`
    padding: 20px;
`;

const StaffManage = () => {
    const navigate = useNavigate();  // Use useNavigate to handle navigation

    const handleButtonClick = () => {
        console.log('Button clicked');
        navigate('/manage/staff/add');  // Correctly navigate to the add staff page
    };

    return (
        <Container>
            <StyledButton onClick={handleButtonClick}>
                Add New Staff
            </StyledButton>
            <div>
                <StaffTableStaff />
            </div>
        </Container>
    );
};

export default StaffManage;
