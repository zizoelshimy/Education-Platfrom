export interface ICourseRepository {
  findById(id: string): Promise<any>;
  findByInstructor(instructorId: string): Promise<any[]>;
  create(courseData: any): Promise<any>;
  update(id: string, courseData: any): Promise<any>;
  delete(id: string): Promise<boolean>;
  findAll(filters?: any): Promise<any[]>;
  findPublished(): Promise<any[]>;
  search(query: string): Promise<any[]>;
}
