import React, { createContext, useState } from "react";

export const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patientId] = useState(localStorage.getItem("patientId"));

  return (
    <PatientContext.Provider value={{ patientId}}>
      {children}
    </PatientContext.Provider>
  );
};
