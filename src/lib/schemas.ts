import { z } from "zod";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const TeacherSchema = z.object({
  teacher_id: z.string().regex(UUID_REGEX, "Invalid Teacher ID"),
  name: z.string().min(2).max(100),
  role: z.enum(["headteacher", "dean", "teacher"]),
  school_id: z.string().regex(UUID_REGEX, "Invalid School ID"),
  school_name: z.string().min(2).max(100),
  token: z.string().optional(),
  is_premium: z.boolean().optional(),
  subscription_tier: z.string().optional(),
  slug: z.string().max(30).optional(),
  logo_url: z.string().url().max(255).optional().or(z.literal("")),
});

export const StudentSchema = z.object({
  id: z.string().regex(UUID_REGEX, "Invalid Student ID"),
  name: z.string().min(2).max(100),
  admission_number: z.string().min(3).max(20),
  class_id: z.string().regex(UUID_REGEX, "Invalid Class ID"),
  class_name: z.string().min(2).max(50),
});

export const AssignmentSchema = z.object({
  class_id: z.string(),
  class_name: z.string(),
  subject_id: z.string(),
  subject_name: z.string(),
  is_class_teacher: z.boolean().optional(),
});

export const SchoolSchema = z.object({
  id: z.string(),
  name: z.string(),
  county: z.string(),
});

export const ClassMeanSchema = z.object({
  class_name: z.string(),
  mean_score: z.number(),
});

export const SubjectMeanSchema = z.object({
  subject_name: z.string(),
  mean_score: z.number(),
});

export const TeacherPerformanceSchema = z.object({
  teacher_id: z.string(),
  teacher_name: z.string(),
  current_mean: z.number(),
  previous_mean: z.number().nullable(),
  change: z.number().nullable(),
  school_subject_mean: z.number().nullable(),
  value_add: z.number(),
  peer_difference: z.number().optional(),
  risk_student_count: z.number(),
});

export const TeacherAnalyticsResponseSchema = z.object({
  teachers: z.array(TeacherPerformanceSchema),
});

export type Teacher = z.infer<typeof TeacherSchema>;
export type Student = z.infer<typeof StudentSchema>;
export type Assignment = z.infer<typeof AssignmentSchema>;
export type School = z.infer<typeof SchoolSchema>;
export type ClassMean = z.infer<typeof ClassMeanSchema>;
export type SubjectMean = z.infer<typeof SubjectMeanSchema>;
export type TeacherPerformance = z.infer<typeof TeacherPerformanceSchema>;
