

type Data = {
  users: User[]
  courses: Course[]
  studentCourses: StudentCourse[]
  students: Student[]
  admins: Admin[]

};

type User = {
  id: number;
  email: string;
  password: string;
  role: 'admin' | 'student';
};

type Course =  {
  id: number;
  title: string;
  date: Date; 

};

type StudentCourse =  {
  id: number;
  registeredAt: string;
  signedAt: string | null;
  user_id: string;
  course_id: string;
};

type Student =  {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

type Admin =  {
  id: number;
  username: string;
  email: string;
};
const defaultData: Data = {
  persons: [],
  users: [],
  courses: [],
  studentCourses: [],
  students: [],
  admins: [],
};


export { Person, Data , User, Course, StudentCourse, Student, Admin, defaultData }