#include <math.h>
#include <unistd.h>

void filter_nader(int32_t *data, double *P, int L) {
    double Re_y = 0;
    double Im_y = 0;
    double sum = 0;
    double theta = M_PI * 25 / 64 ;
    double c = cos(2*theta) ;
    double s = sin(2*theta) ;
    int m = 256;

    for ( int k = 0; k < L; ++k ) {
        if (k<m)
            sum = data[k];
        else
            sum = data[k] - data[k-m];
        sum += Re_y;
        Re_y = c*sum + s*Im_y ;
        Im_y = c*Im_y - s*sum ;
        P[k] = Re_y*Re_y + Im_y*Im_y;
    }
}
void filter_nader2(int32_t *data, float *P, int L) {
    float Re_y = 0;
    float Im_y = 0;
    float sum = 0;
    float theta = M_PI * 25 / 64 ;
    float c = cos(2*theta) ;
    float s = sin(2*theta) ;
    int m = 256;

    for ( int k = 0; k < L; ++k ) {
        if (k<m)
            sum = data[k];
        else
            sum = data[k] - data[k-m];
        sum += Re_y;
        Re_y = c*sum + s*Im_y ;
        Im_y = c*Im_y - s*sum ;
        P[k] = Re_y*Re_y + Im_y*Im_y;
    }
}

void filter_saewoo(int32_t *data ,double *P, int L) {
    double z0, z1, z2;
    int N = 256;
    int k = 100;
    double w = 2 * M_PI * k / N;
    double c = 2 * cos(w);

    z1 = 0;
    z2 = 0;
    for (int idx = 0; idx < L; idx++) {
        if (idx < N) 
            z0 = data[idx] + c*z1 - z2;
        else 
            z0 = data[idx] - data[idx-N] + c*z1 - z2;
        z2 = z1;
        z1 = z0;
        P[idx] = z2 * z2 + z1 * z1 - c * z1 * z2;
    }
}
