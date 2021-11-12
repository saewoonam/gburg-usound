#define M_PI        3.14159265358979323846
#define BUFFER_SIZE 256
#include <math.h>
#include <stdint.h>

double goertzel(int32_t *x, int32_t k) {
    double w, cw, c, P, z0, z1, z2;

    w = 2 * M_PI * k / BUFFER_SIZE;
    cw = cos(w);
    c = 2 * cw;
    // sw = np.sin(w);
    z1 = 0;
    z2 = 0;
    for (int idx = 0; idx < BUFFER_SIZE; idx++) {
        z0 = x[idx] + c * z1 - z2;
        z2 = z1;
        z1 = z0;
    }
    // I = cw*z1 -z2;
    // Q = sw*z1;

    P = z2 * z2 + z1 * z1 - c * z1 * z2;
    return P;
}

double goertzel2(int32_t *x, double c, int32_t block_size, double *delays) {
    // double w, c, P, z0, z1, z2;
    double P, z0, z1, z2;
    /*
    w = 2 * M_PI * k / N;
    c = 2 * cos(w);
    */
    /*
    z1 = 0;
    z2 = 0;
    */
    z1 = delays[0];
    z2 = delays[1];
    for (int idx = 0; idx < block_size; idx++) {
        z0 = x[idx] + c * z1 - z2;
        z2 = z1;
        z1 = z0;
    }
    P = z2 * z2 + z1 * z1 - c * z1 * z2;
    delays[0] = z1;
    delays[1] = z2;
    return P;
}

void slide_goertzel(int32_t *x, double c,
        int32_t block_size, int32_t N, double *P, double *delays) {
    double z0, z1, z2;

    z1 = delays[0];
    z2 = delays[1];
    for (int idx = 0; idx < block_size; idx++) {
        z0 = x[idx] - x[idx-N] + c * z1 - z2;
        z2 = z1;
        z1 = z0;
        P[idx] = z2 * z2 + z1 * z1 - c * z1 * z2;
    }
    delays[0] = z1;
    delays[1] = z2;
}

