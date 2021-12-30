import { Box } from "@chakra-ui/layout";
import React from "react";

const VariantArray = ["small", "regular"] as const;

interface WrapperProps {
  variant?: typeof VariantArray[number];
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = "regular" }) => {
  return (
    <>
      <Box
        maxW={variant == "regular" ? "800px" : "400px"}
        width="100%"
        mt={8}
        mx="auto"
      >
        {children}
      </Box>
    </>
  );
};

export default Wrapper;
