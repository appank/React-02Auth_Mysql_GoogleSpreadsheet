import {
    Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import { FiSearch } from "react-icons/fi"; // Icon search dari react-icons
  
  const WriteTable = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editData, setEditData] = useState({ id: "", name: "", email: "" });
  
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/data");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      }
    };
  
    const handleEdit = (id) => {
      const selected = data.find((item) => item.id === id);
      if (selected) {
        setEditData(selected);
        onOpen();
      }
    };
  
    const handleDelete = async (id) => {
      const konfirmasi = window.confirm("Yakin ingin menghapus data ini?");
      if (!konfirmasi) return;
  
      try {
        const res = await fetch(`http://localhost:5000/delete/${id}`, {
          method: "DELETE",
        });
  
        if (res.ok) {
          alert("Data berhasil dihapus");
          fetchData();
        } else {
          alert("Gagal menghapus data");
        }
      } catch (err) {
        console.error("Error saat hapus:", err);
        alert("Terjadi kesalahan saat menghapus");
      }
    };
  
    const handleUpdate = async () => {
      try {
        const res = await fetch(`http://localhost:5000/update/${editData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editData.name,
            email: editData.email,
          }),
        });
  
        if (res.ok) {
          alert("Data berhasil diperbarui");
          onClose();
          fetchData();
        } else {
          alert("Gagal memperbarui data");
        }
      } catch (err) {
        console.error("Gagal update:", err);
        alert("Terjadi kesalahan saat memperbarui data");
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    // Filter data berdasarkan search
    const filteredData = data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    return (
      <Box bg="white" p={5} borderRadius="lg" boxShadow="md" overflowX="auto">
        {/* Search input */}
        <Box mb={4}>
        <Flex justify="space-between" align="center" mb={4}>
  <Box fontWeight="bold" fontSize="xl">
    Daftar Data
  </Box>
  <InputGroup width="250px">
    <InputLeftElement pointerEvents="none">
      <FiSearch color="gray" />
    </InputLeftElement>
    <Input
         placeholder="Search....."
         value={searchQuery}
         onChange={(e) => setSearchQuery(e.target.value)}
         bg="gray.50"
         borderRadius="md"
         boxShadow="sm"
         focusBorderColor="blue.400"
    />
  </InputGroup>
</Flex>

      
        </Box>
  
        <Box maxHeight="63vh" overflowY="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>No</Th>
                <Th>Nama</Th>
                <Th>Email</Th>
                <Th>Aksi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map((item, i) => (
                <Tr key={item.id}>
                  <Td color="black">{i + 1}</Td>
                  <Td color="black">{item.name}</Td>
                  <Td color="black">{item.email}</Td>
                  <Td>
                    <Flex gap={2}>
                      <Button colorScheme="blue" size="sm" onClick={() => handleEdit(item.id)}>
                        Edit
                      </Button>
                      <Button colorScheme="red" size="sm" onClick={() => handleDelete(item.id)}>
                        Delete
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
  
        {/* Modal edit */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Data</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={3}>
                <FormLabel color="black">Nama</FormLabel>
                <Input
                  color="black"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel color="black">Email</FormLabel>
                <Input
                  color="black"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
                Simpan
              </Button>
              <Button onClick={onClose}>Batal</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    );
  };
  
  export default WriteTable;
  