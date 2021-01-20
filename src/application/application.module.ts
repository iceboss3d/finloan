import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';

@Module({
  providers: [ApplicationService]
})
export class ApplicationModule {}
