// @ts-ignore
import {Module} from '../../../wasm/scd30.js';
import {ESCD30ProbeStatus} from "./enums/scd30.enum";
import {ISCD30Measurement} from "./models/scd30.model";

export class SCD30Module {

    public static sensirion_i2c_init(): void {
        return Module.sensirion_i2c_init()
    }

    public static scd30_probe(): ESCD30ProbeStatus {
        return Module.scd30_probe()
    }

    public static sensirion_sleep_usec(milliseconds: number): void {
        return Module.sensirion_sleep_usec(milliseconds);
    }

    public static scd30_set_measurement_interval(seconds: number): void {
        return Module.scd30_set_measurement_interval(seconds);
    }

    public static scd30_start_periodic_measurement(): void {
        return Module.scd30_start_periodic_measurement(0);
    }

    public static async scd30_read_measurement(): Promise<ISCD30Measurement> {
        return new Promise((resolve, reject) => {
            let co2_ppm, temperature, relative_humidity;
            const err = Module.scd30_read_measurement(co2_ppm, temperature, relative_humidity);
            if (err === ESCD30ProbeStatus.STATUS_OK) {
                reject(Error('Error reading measurement'));
            } else {
                resolve({
                    co2_ppm, temperature, relative_humidity
                })
            }
        })
    }

}
