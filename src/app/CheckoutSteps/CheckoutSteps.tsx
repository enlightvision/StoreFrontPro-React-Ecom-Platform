import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useLocation } from "react-router-dom";

const steps = [
  "Shpping Address",
  "Payment",
  "Products is Ordered Succuessfully!",
];

export default function CheckoutSteps() {
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const query = useQuery();
  const activeStep = Number(query.get("activeStep"));
  return (
    <Box sx={{ width: "100%" }}>
      <Stepper
        // @ts-ignore
        activeStep={activeStep}
        alternativeLabel
        style={{
          padding: "10px",
          width: "100%",
        }}
      >
        {steps.map((label) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
