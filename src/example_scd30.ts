import {ISCD30Measurement} from "./modules/SCD30/models/SCD30.model.js";
import {ESCD30ProbeStatus} from "./modules/SCD30/enums/SCD30.enum.js";
import { scd30 } from "./main.js";

const interval_in_seconds = 2;

(async () => {

    /* Initialize I2C */
    scd30.sensirion_i2c_init();

    /* Busy loop for initialization, because the main loop does not work without
     * a sensor.
     */
    while (scd30.scd30_probe() !== ESCD30ProbeStatus.STATUS_OK) {
        console.log('SCD30 sensor probing failed\n');
        scd30.sensirion_sleep_usec(1000000);
    }

    console.log('SCD30 sensor probing successful\n');

    scd30.scd30_set_measurement_interval(interval_in_seconds);
    scd30.sensirion_sleep_usec(20000);
    scd30.scd30_start_periodic_measurement();
    scd30.sensirion_sleep_usec(interval_in_seconds * 1000000);

    while (1) {
        /* Measure co2, temperature and relative humidity and store into
         * variables.
         */
        try {
            const {co2_ppm, temperature, relative_humidity} = <ISCD30Measurement>await scd30.scd30_read_measurement();

            console.log(
                `Measured co2 concentration: ${co2_ppm}`,
                `Measured temperature:  ${temperature}`,
                `Measured humidity: ${relative_humidity}`)
        } catch (err) {
            console.error(err)
        }
    }
})();
