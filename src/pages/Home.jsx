import React, { useState } from "react";
import { Button, Box, Text, Flex } from "@chakra-ui/react";
import { UserAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import FormInput from "../components/FormInput";
import OtherForm from "../components/OtherForm";
import WriteTable from "../components/writetabel";

function Home() {
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState("formInput"); // 🆕 halaman yang aktif
  const { currentUser, logOutUser } = UserAuth();

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logOutUser();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // 🔀 Ganti konten sesuai halaman/form aktif
  const renderPage = () => {
    switch (activePage) {
      case "formInput":
        return <FormInput />;
        case "editData":
          return <WriteTable />;  
      case "otherForm":
        return <OtherForm />;
      default:
        return <Text color="gray.600">Pilih menu di sidebar</Text>;
    }
  };

  return (
    <DashboardLayout
      user={currentUser}
      onLogout={handleLogout}
      onSelectPage={setActivePage} // 🆕 lempar ke layout
    >
      <Box mb={6}>
        <Flex justify="space-between" align="center">
          <Text fontSize="3xl" fontWeight="bold" color="black">
            Welcome back, {currentUser?.displayName || "User"}
          </Text>
        </Flex>
      </Box>

      {renderPage()}
    </DashboardLayout>
  );
}

export default Home;
