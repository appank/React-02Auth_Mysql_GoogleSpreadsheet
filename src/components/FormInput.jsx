import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";

const FormInput = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        alert("Data berhasil disimpan ke Google Spreadsheet!");
        setName("");
        setEmail("");
      } else {
        alert("Gagal menyimpan data.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan saat menyimpan.");
    }
  };

  return (
    <Box bg="white" p="20px" borderRadius="lg" boxShadow="sm">
      <FormControl mb="15px">
        <FormLabel color="black">Full Name</FormLabel>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          color="black"
        />
      </FormControl>
      <FormControl mb="15px">
        <FormLabel color="black">Email</FormLabel>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          color="black"
        />
      </FormControl>
      <Button colorScheme="teal" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
};

export default FormInput;