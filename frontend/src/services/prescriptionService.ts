import api from "./api";
import { Prescription } from "../types/prescription";

export const uploadPrescription = async (file: File): Promise<Prescription> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<Prescription>("/api/prescription/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getPrescriptionHistory = async (): Promise<Prescription[]> => {
  const response = await api.get<Prescription[]>("/api/prescription/history");
  return response.data;
};