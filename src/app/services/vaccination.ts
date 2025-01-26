export interface Vaccination {
    centre: { id: number };
    mail: string;
    phoneNumber: string;
    last_name: string;
    first_name: string;
    //LocalDateTime
    date: string;
    isVaccined: boolean;
  }
  