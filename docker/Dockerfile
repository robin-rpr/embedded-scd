# ----
# BUILD DRIVER
FROM gcc:5.5 as driver-builder

USER root
RUN mkdir -p /root/app
WORKDIR /root/app

COPY --chown=root:root . .

# Update Common Repository
RUN git submodule update --init --recursive

# Install System Dependencies
RUN apt updat
RUN apt install -y zip

# Make
WORKDIR /root/app/embedded-scd
RUN make prepare
RUN make
RUN make clean
RUN make release

# Build stub release driver
WORKDIR /root/app/embedded-scd/release/scd30
RUN make CONFIG_I2C_TYPE=hw_i2c
RUN make CONFIG_I2C_TYPE=sw_i2c
RUN make clean

# Build Linux release drivers
WORKDIR /root/app/embedded-scd/release/scd30
RUN make CONFIG_I2C_TYPE=hw_i2c hw_i2c_impl_src=hw_i2c/sample-implementations/linux_user_space/sensirion_hw_i2c_implementation.c
RUN make CONFIG_I2C_TYPE=sw_i2c sw_i2c_impl_src=sw_i2c/sample-implementations/linux_user_space/sensirion_sw_i2c_implementation.c
RUN make clean

# ----
# BUILD WASM
FROM trzeci/emscripten as wasm-builder

COPY --from=driver-builder /root/app .

# Setup Emscripten
ENV OPTIMIZE -Os
ENV LDFLAGS ${OPTIMIZE}
ENV CFLAGS ${OPTIMIZE}
ENV CXXFLAGS ${OPTIMIZE}

# Compiling wasm-scd30 bindings
RUN emcc \
      ${OPTIMIZE} \
      --bind \
      -s STRICT=1 \
      -s ALLOW_MEMORY_GROWTH=1 \
      -s MALLOC=emmalloc \
      -s MODULARIZE=1 \
      -s EXPORT_ES6=1 \
      -s USE_ES6_IMPORT_META=0 \
      -s "EXTRA_EXPORTED_RUNTIME_METHODS=[\
        'ccall',\
        'sensirion_i2c_init', \
        'scd30_start_periodic_measurement',\
        'scd30_stop_periodic_measurement',\
        'scd30_enable_automatic_self_calibration',\
        'scd30_read_serial',\
        'scd30_set_measurement_interval',\
        'scd30_set_temperature_offset',\
        'scd30_set_altitude',\
        'scd30_set_forced_recalibration',\
        'scd30_read_measurement',\
        'scd30_get_data_ready',\
        'scd30_probe',\
        'scd30_get_data_ready',\
        'scd30_get_driver_version',\
        'scd30_get_configured_address']" \
      -s "EXPORTED_FUNCTIONS=[]" \
      -o ./scd30.js \
        embedded-scd/release/scd30-*/scd30.c

# Move artifacts
RUN mkdir -p wasm
RUN mv -t wasm scd30.js scd30.wasm

# ----
# BUILD PACKAGE
FROM node:latest as package-builder

USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY --from=wasm-builder --chown=node:node /src .

# Install App Dependencies
RUN npm install --ignore-scripts

# Move Artifacts
RUN mv wasm src/modules/SCD30

# Build
RUN npm run build

# Move Package Config
RUN mv -t dist package.json