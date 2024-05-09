import type {
  ClientPublic,
  ServicePublic,
  AppointmentPublic,
} from "../../client";

export type AppointmentEvent = {
  start: Date;
  end: Date;
  title: string;
  id: string;
  appointment: AppointmentPublic;
  client: ClientPublic | null | undefined;
  service: ServicePublic | null | undefined;
};
