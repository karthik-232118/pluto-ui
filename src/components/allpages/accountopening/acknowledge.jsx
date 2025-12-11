import  { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { FaRegCircle, FaCheckCircle } from 'react-icons/fa';  
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const Acknowledge = ({ handleAcknowledge, documentData,onAcknowledgeChange }) => {
    const location = window.location.pathname;
    const {t}=useTranslation();
    const user_type = localStorage.getItem("user_type");
    const myTask = localStorage.getItem("my_task") === "EndUser";  
    const shouldRenderAcknowledgment = (
        user_type === "ProcessOwner" && myTask || user_type === "EndUser"
    );
    const [isAcknowledged, setIsAcknowledged] = useState(documentData?.IsAncknowledged || false);
    useEffect(() => {
        setIsAcknowledged(documentData?.IsAncknowledged || false);
    }, [documentData]);

    const handleCheckboxChange = (event) => {
        const checked = event.target.checked;
        setIsAcknowledged(checked);
        handleAcknowledge(checked); 
        onAcknowledgeChange(checked);
    };

    return (

        <div>
            {shouldRenderAcknowledgment && (
                <>
                    <FormControlLabel
                        disabled={documentData?.IsAncknowledged} // Disable checkbox if already acknowledged
                        control={
                            <Checkbox
                                icon={<FaRegCircle />}
                                checked={isAcknowledged}
                                checkedIcon={<FaCheckCircle />}
                                onChange={handleCheckboxChange}  // Trigger handleAcknowledge function on change
                                aria-label="Acknowledge SOP/Document"
                            />
                        }
                        label={t("acknowledge.label")}
                    />
                    <p style={{
                        fontSize: '14px',
                        color: '#666666',
                        padding: "0",
                        margin: "0"
                    }}>
                        {t("acknowledge.description")} {location === "/documents/view" ? "Document." : "SOP."}
                    </p>
                </>
            )}
        </div>
    );
}

export default Acknowledge;

Acknowledge.propTypes = {
    handleAcknowledge: PropTypes.func.isRequired,
    documentData: PropTypes.object.isRequired,
    onAcknowledgeChange: PropTypes.func.isRequired,
};