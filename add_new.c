//sample C file to add 2 numbers - int and floats
#include <math.h>

int add_int(int, int);
float add_float(float, float);
double dbl_cos(double num);
float flt_cos(float num);

int add_int(int num1, int num2){
    return num1 + num2;
}

float add_float(float num1, float num2){
    return num1 + num2;
}

double dbl_cos(double num) {
    return cos(num);
}
float flt_cos(float num) {
    return cos(num);
}
