import { EventDto } from '../../core/models/event-dto';

export interface ResolvedData {
  event: EventDto;
  error?: any;
}
