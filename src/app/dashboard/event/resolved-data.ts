import { EventDto } from '../../core/models/event-dto';
import { CheckIn } from '../../core/models/check-in';

export interface ResolvedData {
  event: EventDto;
  checkIns: CheckIn[];
  error?: any;
}
