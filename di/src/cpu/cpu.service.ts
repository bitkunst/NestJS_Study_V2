import { Injectable } from '@nestjs/common';
import { PowerService } from 'src/power/power.service';

@Injectable()
export class CpuService {
    /**
     * @dev
     * Behind the scenes, whenever Nest creates an instance of the CpuService
     * it first creates an instance of the PowerService
     * and provides it to the Cpu constructor
     */
    constructor(private powerService: PowerService) {}

    compute(input1: number, input2: number) {
        console.log(`Drawing 10 watts of power from PowerService`);
        this.powerService.supplyPower(10);

        return input1 + input2;
    }
}
