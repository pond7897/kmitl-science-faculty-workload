export interface KmitlTeachTableEntry {
  teach_table_id: string;
  subject_id: string;
  subject_name_th: string;
  subject_name_en: string;
  credit: string;
  credit_lps: string;
  credit_str: string;
  section: string;
  sec_pair: string;
  lect_or_prac: string;
  teach_day: string;
  teach_time: string;
  teach_time2: string;
  classroom: string;
  room_no: string;
  classbuilding: string;
  building_no: string;
  teacher_list_th: string;
  teacher_list_en: string;
  count: number;
}

export interface KmitlTeachTableGroup {
  subject_type_name_th: string;
  subject_type_name_en: string;
  data: KmitlTeachTableEntry[];
}

export interface KmitlTeachTableCurriculum {
  faculty_id: string;
  department_id: string;
  curriculum2_id: string;
  class: string;
  faculty_name_th: string;
  faculty_name_en: string;
  department_name_th: string;
  department_name_en: string;
  curriculum_name_th: string;
  curriculum_name_en: string;
  teachtable: KmitlTeachTableGroup[];
}

export type KmitlTeachTableResponse = KmitlTeachTableCurriculum[];

export interface WorkloadCourseLookupSection {
  teachTableId: string;
  section: string;
  secPair: string;
  teachingType: string;
  teachDay: string;
  teachTimeStart: string;
  teachTimeEnd: string;
  subjectTypeNameTh: string;
  subjectTypeNameEn: string;
  enrolledCount: number;
}

export interface WorkloadCourseLookupEntity {
  id: string;
  nameTh: string;
  nameEn: string;
}

export interface WorkloadCourseLookupOffering {
  classYear: string;
  faculty: WorkloadCourseLookupEntity;
  department: WorkloadCourseLookupEntity;
  curriculum: WorkloadCourseLookupEntity;
  sections: WorkloadCourseLookupSection[];
}

export interface WorkloadCourseLookupData {
  subjectId: string;
  courseNameTh: string;
  courseNameEn: string;
  creditUnits: number | null;
  creditDisplay: string;
  offerings: WorkloadCourseLookupOffering[];
}

export type WorkloadCourseLookupResponse =
  | { data: WorkloadCourseLookupData }
  | { error: string };
