import  { useEffect } from 'react';
import PropTypes from 'prop-types';

const DateComponent = ({ formData, setFormData, markerData }) => {
  // date in dd/mm/yy format
  const date = new Date().toLocaleDateString();
  useEffect(() => {
    formData[markerData.markerId] = {
      markerId: markerData.markerId,
      markerType: 'text',
      data: date,
    };
    setFormData(formData);
  }, []);
  //   console.log(date);
  return <div>{date}</div>;
};

export default DateComponent;

DateComponent.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  markerData: PropTypes.shape({
    markerId: PropTypes.string.isRequired,
  }).isRequired,
};

