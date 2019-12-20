// @ts-ignore
import Module from '../scd30/wasm-scd30/scd30.js';
import {ESCD30ProbeStatus} from "./enums/scd30.enum.js";
import {ISCD30Measurement} from "./models/scd30.model.js";

const module = Module();

export class SCD30Module {

    public static sensirion_i2c_init(): void {
        return module.ccall('sensirion_i2c_init', 'void', [], arguments);
    }

    public static scd30_probe(): ESCD30ProbeStatus | number {
        return module.ccall('scd30_probe', 'number', [], arguments);
    }

    public static sensirion_sleep_usec(milliseconds: number): void {
        return module.ccall('sensirion_sleep_usec', 'void', ['number'], arguments);
    }

    public static scd30_set_measurement_interval(seconds: number): number {
        return module.ccall('scd30_set_measurement_interval', 'number', ['number'], arguments);
    }

    public static scd30_start_periodic_measurement(ambient_pressure_mbar: number = 0): number {
        return module.ccall('scd30_start_periodic_measurement', 'number', ['number'], arguments);
    }

    public static async scd30_read_measurement(): Promise<ISCD30Measurement> {
        return new Promise((resolve, reject) => {
            const co2_ppm = module._malloc(4);
            const temperature = module._malloc(4);
            const relative_humidity = module._malloc(4);

            const err = module.ccall('scd30_read_measurement', 'number', ['number', 'number', 'number'], [co2_ppm, temperature, relative_humidity]);
            if (err === ESCD30ProbeStatus.STATUS_OK) {
                reject(Error(`${err} - Error reading measurement`));
            } else {
                resolve({
                    co2_ppm, temperature, relative_humidity
                })
            }
        })
    }

}
