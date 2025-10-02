export type IExamPublish = {
  id?: number;
  exam_id: number;
  year_id: number;
  publish_status: 'publish' | 'editable';
  school_id: number;
  created_at?: string;
  updated_at?: string;
};


