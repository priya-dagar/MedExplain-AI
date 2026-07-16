import api from "./api";
import { HealthRecordItem,DashboardSummary } from "../types/healthRecord";

export const getTimeline = async (): Promise<HealthRecordItem[]> => {
  const response = await api.get<HealthRecordItem[]>("/api/health-record/timeline");
  return response.data;
};

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await api.get<DashboardSummary>("/api/health-record/summary");
  return response.data;
};