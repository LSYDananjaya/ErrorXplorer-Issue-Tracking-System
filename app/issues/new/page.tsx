"use client";

import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { TextField, Button, Callout } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Dynamically import SimpleMDE only on the client side
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface issueForm {
  title: string;
  description: string;
}

const NewIssuePage = () => {
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const { register, control, handleSubmit, reset } = useForm<issueForm>();

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    } else {
      console.error("User email not found in session storage.");
      setError("User email not found. Please log in again.");
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      {error && (
        <Callout.Root color="red">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form
        className="max-w-xl space-y-3 mx-auto"
        onSubmit={handleSubmit(async (data) => {
          if (!userEmail) {
            setError("User email not found. Please log in again.");
            return;
          }

          try {
            await axios.post(
              "/api/issues",
              { ...data, userEmail },
              {
                headers: {
                  "x-user-email": userEmail,
                },
              }
            );
            router.push("/issues");
          } catch (error) {
            console.error("Error submitting form:", error);
            setError("An Unexpected Error Occurred");
          }
        })}
      >
        <TextField.Root
          placeholder="Title"
          {...register("title")}
          className="w-full"
        ></TextField.Root>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />

        <div className="flex justify-between">
          <Button
            type="button"
            className="w-full md:w-auto"
            color="ruby"
            onClick={() => reset()}
          >
            Reset
          </Button>
          <Button type="submit" color="teal" className="w-full md:w-auto">
            Submit New Issue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewIssuePage;
