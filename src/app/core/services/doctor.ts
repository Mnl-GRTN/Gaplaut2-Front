import { Center } from "./center";
import { Role } from "./role";

export interface Doctor {
    id: number;
    lastName: string;
    firstName: string;
    centre: Center;
    email: string;
    password: string;
    roles: Role[];
    passwordChanged: boolean;
  }