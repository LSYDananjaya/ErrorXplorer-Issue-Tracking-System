"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import * as Form from "@radix-ui/react-form";
import * as Label from "@radix-ui/react-label";
import { Callout, Box, Heading, Flex } from "@radix-ui/themes";
import BackgroundIcons from "./BackgroundIcons"; // Import the BackgroundIcons component
import "./styles.css"; // Ensure you have the necessary styles

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  profilePicture: string; // Changed to string to handle URL or path
}

const RegisterPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm<RegisterForm>();

  const onSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post("/api/register", {
        username: data.username,
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        profilePicture: data.profilePicture, // Send the profile picture path or URL
      });
      router.push("/login");
    } catch (error) {
      setError("Registration failed");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profilePicture", file.name); // Set the file name as the profile picture path
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
      <Box className="glass-container p-8 rounded-lg shadow-xl w-full max-w-3xl bg-white">
        <Heading as="h1" size="5" className="mb-6 text-center text-black">
          Register
        </Heading>
        {error && (
          <Callout.Root className="mb-4" color="red">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}
        <Form.Root className="FormRoot" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left Section */}
            <div className="space-y-4">
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

              <Form.Field className="FormField" name="fullName">
                <div className="flex items-baseline justify-between">
                  <Label.Root
                    className="text-[15px] font-medium leading-[35px] text-black"
                    htmlFor="fullName"
                  >
                    Full Name
                  </Label.Root>
                </div>
                <Form.Control asChild>
                  <input
                    className="Input mt-1 w-full"
                    type="text"
                    id="fullName"
                    required
                    {...register("fullName")}
                  />
                </Form.Control>
              </Form.Field>

              <Form.Field className="FormField" name="username">
                <div className="flex items-baseline justify-between">
                  <Label.Root
                    className="text-[15px] font-medium leading-[35px] text-black"
                    htmlFor="username"
                  >
                    Username
                  </Label.Root>
                  <Form.Message className="FormMessage" match="valueMissing">
                    Please enter your username
                  </Form.Message>
                </div>
                <Form.Control asChild>
                  <input
                    className="Input mt-1 w-full"
                    type="text"
                    id="username"
                    required
                    {...register("username")}
                  />
                </Form.Control>
              </Form.Field>
            </div>

            {/* Right Section */}
            <div className="space-y-4">
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

              <Form.Field className="FormField" name="confirmPassword">
                <div className="flex items-baseline justify-between">
                  <Label.Root
                    className="text-[15px] font-medium leading-[35px] text-black"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </Label.Root>
                  <Form.Message className="FormMessage" match="valueMissing">
                    Please confirm your password
                  </Form.Message>
                </div>
                <Form.Control asChild>
                  <input
                    className="Input mt-1 w-full"
                    type="password"
                    id="confirmPassword"
                    required
                    {...register("confirmPassword")}
                  />
                </Form.Control>
              </Form.Field>

              <Form.Field className="FormField" name="profilePicture">
                <div className="flex items-baseline justify-between">
                  <Label.Root
                    className="text-[15px] font-medium leading-[35px] text-black"
                    htmlFor="profilePicture"
                  >
                    Profile Picture
                  </Label.Root>
                </div>
                <Form.Control asChild>
                  <div className="relative w-full">
                    <input
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      type="file"
                      id="profilePicture"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="profilePicture"
                      className="block w-3/5  py-2 px-4 bg-gray-700 rounded-xl text-white text-center cursor-pointer hover:bg-gray-800 transition"
                    >
                      Choose Profile Picture
                    </label>
                  </div>
                </Form.Control>
              </Form.Field>
            </div>
          </div>

          <Form.Submit asChild>
            <button className="Button mt-6 w-full bg-black text-white hover:bg-gray-800">
              Register
            </button>
          </Form.Submit>
        </Form.Root>
      </Box>
    </Flex>
  );
};

export default RegisterPage;
