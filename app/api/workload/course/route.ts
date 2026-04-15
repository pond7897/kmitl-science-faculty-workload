import { NextResponse } from "next/server";
import type {
  KmitlTeachTableCurriculum,
  KmitlTeachTableGroup,
  KmitlTeachTableResponse,
  WorkloadCourseLookupOffering,
  WorkloadCourseLookupResponse,
} from "@/lib/types/workload";

const KMILT_REGIS_API_URL = "https://regis.reg.kmitl.ac.th/api/";

const buildKmitlLookupUrl = (
  subjectId: string,
  year: string,
  semester: string,
) => {
  const params = new URLSearchParams({
    function: "get-teach-table-show",
    mode: "by_subject_id",
    selected_year: year,
    selected_semester: semester,
    search_all_faculty: "true",
    search_all_department: "true",
    search_all_curriculum: "true",
    search_all_class_year: "true",
    selected_subject_id: subjectId,
  });

  return `${KMILT_REGIS_API_URL}?${params.toString()}`;
};

const flattenSections = (teachtable: KmitlTeachTableCurriculum["teachtable"]) =>
  teachtable.flatMap((group: KmitlTeachTableGroup) =>
    group.data.map((item) => ({
      teachTableId: item.teach_table_id,
      section: item.section,
      secPair: item.sec_pair,
      teachingType: item.lect_or_prac,
      teachDay: item.teach_day,
      teachTimeStart: item.teach_time,
      teachTimeEnd: item.teach_time2,
      subjectTypeNameTh: group.subject_type_name_th,
      subjectTypeNameEn: group.subject_type_name_en,
      enrolledCount: item.count,
    })),
  );

const normalizeOffering = (
  curriculum: KmitlTeachTableCurriculum,
): WorkloadCourseLookupOffering => ({
  classYear: curriculum.class,
  faculty: {
    id: curriculum.faculty_id,
    nameTh: curriculum.faculty_name_th,
    nameEn: curriculum.faculty_name_en,
  },
  department: {
    id: curriculum.department_id,
    nameTh: curriculum.department_name_th,
    nameEn: curriculum.department_name_en,
  },
  curriculum: {
    id: curriculum.curriculum2_id,
    nameTh: curriculum.curriculum_name_th,
    nameEn: curriculum.curriculum_name_en,
  },
  sections: flattenSections(curriculum.teachtable),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get("subjectId")?.trim();
  const year = searchParams.get("year")?.trim() || "2568";
  const semester = searchParams.get("semester")?.trim() || "1";

  if (!subjectId) {
    return NextResponse.json<WorkloadCourseLookupResponse>(
      { error: "subjectId is required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(buildKmitlLookupUrl(subjectId, year, semester), {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json<WorkloadCourseLookupResponse>(
        { error: "Failed to fetch course data" },
        { status: response.status },
      );
    }

    const payload = (await response.json()) as KmitlTeachTableResponse;
    const curriculum = payload[0];
    const firstSection = curriculum?.teachtable.flatMap((group) => group.data)[0];

    if (!curriculum || !firstSection) {
      return NextResponse.json<WorkloadCourseLookupResponse>(
        { error: "Course not found" },
        { status: 404 },
      );
    }

    const normalized: WorkloadCourseLookupResponse = {
      data: {
        subjectId: firstSection.subject_id,
        courseNameTh: firstSection.subject_name_th,
        courseNameEn: firstSection.subject_name_en,
        creditUnits: Number.parseInt(firstSection.credit, 10) || null,
        creditDisplay: firstSection.credit_str,
        offerings: payload.map(normalizeOffering),
      },
    };

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Failed to lookup KMITL course", error);
    return NextResponse.json<WorkloadCourseLookupResponse>(
      { error: "Unable to lookup course right now" },
      { status: 500 },
    );
  }
}
