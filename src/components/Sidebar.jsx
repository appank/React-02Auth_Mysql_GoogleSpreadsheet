import {
  Box,
  VStack,
  Text,
  Icon,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
} from "@chakra-ui/react";
import { FiHome, FiUser, FiSettings, FiDatabase } from "react-icons/fi";

const Sidebar = ({ isOpen, onClose, onSelectPage }) => {
  return (
    <>
      {/* Sidebar Desktop */}
      <Box
        w="250px"
        bg="teal.500"
        color="white"
        h="100vh"
        p="20px"
        pos="fixed"
        display={{ base: "none", md: "block" }}
      >
        <Text fontSize="2xl" mb="40px" fontWeight="bold">
          My Dashboard
        </Text>
        <SidebarContent onItemClick={onSelectPage} />
      </Box>

      {/* Drawer Mobile */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent w="250px" bg="teal.500" color="white">
          <DrawerHeader borderBottomWidth="1px">My Dashboard</DrawerHeader>
          <DrawerBody p="20px">
            <SidebarContent
              onItemClick={(label) => {
                onSelectPage(label);
                onClose(); // Supaya drawer tertutup di mobile
              }}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const SidebarContent = ({ onItemClick = () => {} }) => (
  <VStack align="start" spacing="20px">
    <SidebarItem icon={FiHome} label="Dashboard" onClick={() => onItemClick("dashboard")} />
    <SidebarItem icon={FiUser} label="Input Data" onClick={() => onItemClick("formInput")} />
    <SidebarItem icon={FiDatabase} label="Edit Data" onClick={() => onItemClick("editData")} />
    <SidebarItem icon={FiSettings} label="Lainnya" onClick={() => onItemClick("otherForm")} />
  </VStack>
);

const SidebarItem = ({ icon, label, onClick }) => (
  <Box
    display="flex"
    alignItems="center"
    gap="10px"
    cursor="pointer"
    _hover={{ opacity: 0.8 }}
    onClick={onClick}
  >
    <Icon as={icon} boxSize={5} />
    <Text>{label}</Text>
  </Box>
);

export default Sidebar;
