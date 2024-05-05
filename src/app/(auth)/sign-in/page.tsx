"use client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
function page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceValue(username, 300);
  const { toast } = useToast();
  const router = useRouter();
  return <div>page</div>;
}

export default page;
