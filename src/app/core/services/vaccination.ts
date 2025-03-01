export interface Vaccination {
    id?: number;
    centre: { id: number };
    mail: string;
    phoneNumber: string;
    last_name: string;
    first_name: string;
    date: string;
    isVaccined: boolean;
  }
  