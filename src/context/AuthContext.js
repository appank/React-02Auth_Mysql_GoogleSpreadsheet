import { useContext, createContext, useState } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Simulasi login email (ganti dengan fetch ke backend kamu nanti)
  const signInWithEmail = async (email, password) => {
    // TODO: Ganti dengan login API kamu
    console.log("Login with Email:", email, password);
    const user = { email }; // contoh user
    setCurrentUser(user);
    return user;
  };

  // Simulasi login Google (kalau udah pakai OAuth backend)
  const signInWithGoogle = async () => {
    // TODO: Ganti dengan Google OAuth dari backend kamu
    console.log("Login with Google");
    const user = { email: "googleuser@example.com" };
    setCurrentUser(user);
    return user;
  };

  const logOutUser = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signInWithEmail,
        signInWithGoogle,
        logOutUser,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
