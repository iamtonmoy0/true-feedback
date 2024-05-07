"use client";
import { useToast } from "@/components/ui/use-toast";
import { signupSchema } from "@/schemas/signUpSchema";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { useDebounceValue } from "usehooks-ts";
import { z } from "zod";

function page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceValue(username, 300);
  const { toast } = useToast();
  const router = useRouter();
  // zod implementation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (debounced) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${debounced}`
          );
          console.log(response);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError;
          setUsernameMessage("failed to check unique username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsername();
  }, [debounced]);

  // handle submit
  const handleSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/sign-up", data);
      toast({
        title: "success",
        description: res.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {}
  };
  return <div>page</div>;
}

export default page;
