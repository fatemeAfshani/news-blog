import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { NewsOrder } from '../newsStatus.enum';

@Injectable()
export class NewsOrderValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!this.isValidOrder(value)) {
      throw new BadRequestException(`${value} is not valid news status`);
    }
    return value;
  }

  isValidOrder(status: any): boolean {
    return Object.values(NewsOrder).includes(status) ? true : false;
  }
}
