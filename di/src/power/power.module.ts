import { Module } from '@nestjs/common';
import { PowerService } from './power.service';

@Module({
    providers: [PowerService], // private
    exports: [PowerService], // exports -> public
})
export class PowerModule {}
