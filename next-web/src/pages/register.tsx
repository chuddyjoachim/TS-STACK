import React from "react";
import { Form, Formik } from "formik";
import {
  Box,
  Button,
} from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/inputfield";
import { useRegisterMutation } from "../generated/graphql";

interface registerProps {}


const Register: React.FC<registerProps> = () => {
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "", email: "" }}
        onSubmit={async (values) => {
          const response = await register(values);
          console.log(response);
          
          if(response.data?.register.errors){

          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="email"
              placeholder="email"
              label="email"
              type="email"
            />
            <Box mt="2">
              <InputField
                name="username"
                placeholder="username"
                label="username"
                type="text"
              />
            </Box>
            <Box mt="2">
              <InputField
                name="password"
                placeholder="password"
                label="password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              colorScheme="teal"
              type="submit"
              isLoading={isSubmitting}
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
