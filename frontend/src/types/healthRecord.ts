export interface HealthRecordItem {
  record_type: string;
  source_id: number;
  summary: string;
  created_at: string;
}

export interface DashboardSummary {
  chat_count: number;
  last_prescription_summary: string | null;
  last_activity_summary: string | null;
  last_activity_date: string | null;
}