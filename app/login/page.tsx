"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import * as Form from "@radix-ui/react-form";
import * as Label from "@radix-ui/react-label";
import { Callout, Box, Heading, Flex } from "@radix-ui/themes";
import { useUser } from "../UserContext"; // Import the UserContext
import BackgroundIcons from "./BackgroundIcons"; // Import the BackgroundIcons component
import "./styles.css"; // Ensure you have the necessary styles

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginForm>();
  const { setUser } = useUser(); // Use the UserContext

  const onSubmit = async (data: LoginForm) => {
    try {
      // Sending login request to the backend
      const response = await axios.post("/api/login", data, {
        withCredentials: true, // Ensures cookies are sent with the request
      });

      // If login is successful, save user details in session storage and update the context
      if (response.status === 200) {
        const user = response.data.user;
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("userEmail", user.email); // Also store user email separately
        setUser(user); // Update the user state in the context
        router.push("/"); // Redirect to homepage or dashboard
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className="min-h-screen p-4 "
    >
      <BackgroundIcons /> {/* Add the BackgroundIcons component */}
      <Box className="glass-container p-8 rounded-lg shadow-xl w-full max-w-md bg-white">
        <Heading as="h1" size="4" className="mb-6 text-center text-black">
          Login
        </Heading>
        {error && (
          <Callout.Root className="mb-4" color="red">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}
        <Form.Root className="FormRoot" onSubmit={handleSubmit(onSubmit)}>
          <Form.Field className="FormField" name="email">
            <div className="flex items-baseline justify-between">
              <Label.Root
                className="text-[15px] font-medium leading-[35px] text-black"
                htmlFor="email"
              >
                Email
              </Label.Root>
              <Form.Message className="FormMessage" match="valueMissing">
                Please enter your email
              </Form.Message>
              <Form.Message className="FormMessage" match="typeMismatch">
                Please provide a valid email
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                className="Input mt-1 w-full"
                type="email"
                id="email"
                required
                {...register("email")}
              />
            </Form.Control>
          </Form.Field>

          <Form.Field className="FormField" name="password">
            <div className="flex items-baseline justify-between">
              <Label.Root
                className="text-[15px] font-medium leading-[35px] text-black"
                htmlFor="password"
              >
                Password
              </Label.Root>
              <Form.Message className="FormMessage" match="valueMissing">
                Please enter your password
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                className="Input mt-1 w-full"
                type="password"
                id="password"
                required
                {...register("password")}
              />
            </Form.Control>
          </Form.Field>

          <Form.Submit asChild>
            <button className="Button mt-6 w-full bg-black text-white hover:bg-gray-800">
              Login
            </button>
          </Form.Submit>
        </Form.Root>
      </Box>
    </Flex>
  );
};

export default LoginPage;
