import { ReactFormGenerator } from "react-form-builder2";
import PropTypes from "prop-types";

const FormPreview = ({ formBuilderData }) => {
  const isEmpty = !formBuilderData || formBuilderData.length === 0;

  return (
    <div
      className="card shadow-sm mx-auto"
      style={{ maxWidth: "600px", padding: "20px" }}
    >
      {isEmpty ? (
        <div className="alert alert-info text-center" role="alert">
          <h4 className="alert-heading">No Form Data Available</h4>
          <p>It seems there’s no form to preview at the moment.</p>
          <hr />
          <p className="mb-0">
            Please add some fields to your form to see the preview here.
          </p>
        </div>
      ) : (
        <ReactFormGenerator
          data={formBuilderData}
          form_action="/submit"
          form_method="POST"
          submitButton={
            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{
                backgroundColor: "#3B82F6",
                borderColor: "#3B82F6",
                color: "#fff",
              }}
            >
              Submit
            </button>
          }
        />
      )}
    </div>
  );
};

export default FormPreview;

FormPreview.propTypes = {
  formBuilderData: PropTypes.array,
};
FormPreview.defaultProps = {
  formBuilderData: [],
};
FormPreview.displayName = "FormPreview";
