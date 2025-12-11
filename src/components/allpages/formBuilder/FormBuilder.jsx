import { ReactFormBuilder } from "react-form-builder2";
import PropTypes from "prop-types";

const FormBuilder = ({ formBuilderData, onFormDataChange }) => {
  return (
    <div className="card shadow p-4 mx-auto" style={{ width: "100%" }}>
      <ReactFormBuilder
        editMode
        data={formBuilderData}
        onPost={onFormDataChange}
      />
    </div>
  );
};

export default FormBuilder;

FormBuilder.propTypes = {
  formBuilderData: PropTypes.array,
  onFormDataChange: PropTypes.func,
};
FormBuilder.defaultProps = {
  formBuilderData: [],
  onFormDataChange: () => {},
};
FormBuilder.displayName = "FormBuilder";
