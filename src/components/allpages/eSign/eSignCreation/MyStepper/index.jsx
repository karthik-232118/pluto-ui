import { Stepper, Step } from "react-form-stepper";
import PropTypes from "prop-types";

function MyStepper({ steps, activeStep }) {
  const customStyles = {
    fontFamily: "Inter", // Replace with your desired font
  };

  return (
    <Stepper
      activeStep={activeStep}
      connectorStateColors
      style={{ fontFamily: "Inter" }}
    >
      {steps.map((step, index) => (
        <Step
          key={index}
          label={
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: activeStep === index ? "#4338CA" : "#000",
                  fontWeight: 500,
                  fontFamily: "Inter",
                }}
              >
                {step.header}
              </p>
              <p
                style={{
                  color: activeStep === index ? "#4338CA" : "#000",
                  fontSize: "0.85em",
                  fontFamily: "Inter",
                }}
              >
                {step.subHeader}
              </p>
            </div>
          }
          styleConfig={{
            activeIcon: <span>{index + 1}</span>,
            activeBgColor: "#2566e8",
            completedBgColor: "#4caf50",
            inactiveBgColor: "#e0e0e0",
            activeTextColor: "#ffffff",
            completedTextColor: "#ffffff",
            inactiveTextColor: "#9e9e9e",
            size: "2rem",
            circleFontSize: "1rem",
            labelFontSize: "0.875rem",
            ...customStyles,
          }}
        />
      ))}
    </Stepper>
  );
}

export default MyStepper;

MyStepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      subHeader: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeStep: PropTypes.number.isRequired,
};