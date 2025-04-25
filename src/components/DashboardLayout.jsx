// components/DashboardLayout.jsx
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children, user, onLogout, onSelectPage }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex minH="100vh" flexDirection={{ base: "column", md: "row" }}>
      <Sidebar onSelectPage={onSelectPage} isOpen={isOpen} onClose={onClose} />
      <Box
        flex="1"
        ml={{ base: 0, md: "250px" }}
        p="4"
        bg="gray.50"
        minH="100vh"
      >
        <Topbar user={user} onOpenSidebar={onOpen} onLogout={onLogout} />
        <Box mt="4">{children}</Box>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
