import { describe, it, expect } from 'vitest';
import { TeacherSchema, StudentSchema, TeacherPerformanceSchema } from '@/lib/schemas';

describe('Zod Schemas', () => {
  it('should validate a correct teacher object', () => {
    const teacher = {
      teacher_id: 'T1',
      name: 'John Doe',
      role: 'teacher',
      school_id: 'S1',
      school_name: 'Test High',
      is_premium: true
    };
    const result = TeacherSchema.safeParse(teacher);
    expect(result.success).toBe(true);
  });

  it('should fail validation for incorrect role', () => {
    const teacher = {
      teacher_id: 'T1',
      name: 'John Doe',
      role: 'invalid_role',
      school_id: 'S1',
      school_name: 'Test High'
    };
    const result = TeacherSchema.safeParse(teacher);
    expect(result.success).toBe(false);
  });

  it('should validate a student object', () => {
    const student = {
      id: 'ST1',
      name: 'Jane Smith',
      admission_number: 'ADM001',
      class_id: 'C1',
      class_name: 'Form 1A'
    };
    const result = StudentSchema.safeParse(student);
    expect(result.success).toBe(true);
  });

  it('should validate teacher performance data', () => {
    const performance = {
      teacher_id: 'T1',
      teacher_name: 'John Doe',
      current_mean: 75.5,
      previous_mean: 70.0,
      change: 5.5,
      school_subject_mean: 68.0,
      value_add: 7.5,
      risk_student_count: 2
    };
    const result = TeacherPerformanceSchema.safeParse(performance);
    expect(result.success).toBe(true);
  });
});
