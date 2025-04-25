import {
  Button,
  Center,
  Divider,
  Flex,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const { currentUser, setCurrentUser } = UserAuth();
  const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

const handleLoginWithUsername = async () => {
  setLoading(true);
  try {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    setCurrentUser(data); // Simpan user ke context
    toast({ title: "Login successful", status: "success" });
  } catch (err) {
    toast({ title: "Login failed", description: err.message, status: "error" });
  } finally {
    setLoading(false);
  }
};
  

  const handleSignInWithGoogle = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <Center w="100%" h="100dvh" px="10px">
      <Flex flexDir="column" maxW="400px" w="100%" gap="20px">
        <Text fontSize="lg" mt="20px">Sign in with Email</Text>
        <Input
          color="black"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          color="black"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          isLoading={loading}
          onClick={handleLoginWithUsername}
          colorScheme="teal"
        >
          Login
        </Button>

        <Text color="gray.600">
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "blue" }}>
            Register
          </Link>
        </Text>

        <Flex my="25px" align="center" px="10%">
          <Divider />
          <Text px="15px">OR</Text>
          <Divider />
        </Flex>

        <Button onClick={handleSignInWithGoogle} colorScheme="red">
          Sign in with Google
        </Button>
      </Flex>
    </Center>
  );
}

export default Login;
