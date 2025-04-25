import { useState, useEffect } from "react";
import {
  Skeleton,
  SkeletonText,
  Stack,
  Box,
  SimpleGrid,
  Image,
  Text,
  Button,
  Flex,
} from "@chakra-ui/react";

const OtherForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/data2");
        const data = await res.json();
        console.log("Data dari backend:", data); // debug log
  
        const formatted = data.map((item) => ({
          id: item.id,
          title: item.nameproduct || "Tanpa Judul",
          description: item.deskripsi || "Tidak ada deskripsi",
          image: item.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
          price: item.harga || "-",
        }));
  
        setProducts(formatted);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  
  

  const ProductSkeletonCard = () => (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} maxW="sm">
      <Skeleton height="200px" mb={4} />
      <SkeletonText mt="4" noOfLines={2} spacing="3" />
      <Skeleton height="20px" mt={3} width="50%" />
      <Stack direction="row" spacing="4" mt={4}>
        <Skeleton height="36px" width="80px" borderRadius="md" />
        <Skeleton height="36px" width="100px" borderRadius="md" />
      </Stack>
    </Box>
  );

  return (
    <Box p={5}>
      <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={6}>
        {isLoading
          ? [...Array(10)].map((_, i) => <ProductSkeletonCard key={i} />)
          : products.map((product) => (
              <Box key={product.id} borderWidth="1px" borderRadius="lg" overflow="hidden" maxW="sm">
                <Image src={product.image} alt={product.title} />
                <Box p={4}>
                  <Flex maxW="300px">
                  <Text fontWeight="bold" noOfLines={2}>{product.title}</Text> 
                  </Flex>
                  <Text color="gray.500" fontSize="sm" mt={2}>{product.description}</Text>
                  <Text fontSize="lg" color="blue.600" fontWeight="semibold" mt={2}>{product.price}</Text>
                </Box>
                <Box p={4}>
  <Stack direction={{ base: "column",sm: "row", md: "column", lg: "column", xl: "row" }} spacing={2}>
    <Button colorScheme="blue">Buy now</Button>
    <Button variant="outline">Add to cart</Button>
  </Stack>
</Box>

              </Box>
            ))}
      </SimpleGrid>
    </Box>
  );
};

export default OtherForm;
