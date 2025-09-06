export interface IUserRepository {
  findById(id: string): Promise<any>;
  findByEmail(email: string): Promise<any>;
  create(userData: any): Promise<any>;
  update(id: string, userData: any): Promise<any>;
  delete(id: string): Promise<boolean>;
  findAll(filters?: any): Promise<any[]>;
  findByRole(role: string): Promise<any[]>;
}
