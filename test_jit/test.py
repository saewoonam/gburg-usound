from numba import jit
import numpy as np
import time
import timeit

# Sliding Goertzel
def sg(x, k=25*4):
    Pxx = []
    N = 64*4
    w = 2*np.pi*k/N;
    cw = np.cos(w);
    c = 2*cw;
    z1=0;
    z2=0;
    for idx in range(len(x)):
        if idx<N:
            z0 = x[idx] + c*z1 - z2;
        else:
            z0 = x[idx] - x[idx-N] + c*z1 -z2;
        z2 = z1;
        z1 = z0;

        P = z2*z2 + z1*z1 - c * z1*z2
        Pxx.append(P)
    return np.array(Pxx)

@jit
def sg_jit(x, k=25*4):
    Pxx = []
    N = 64*4
    w = 2*np.pi*k/N;
    c = 2*np.cos(w);
    z1=0;
    z2=0;
    for idx in range(len(x)):
        if idx<N:
            z0 = x[idx] + c*z1 - z2;
        else:
            z0 = x[idx] - x[idx-N] + c*z1 -z2;
        z2 = z1;
        z1 = z0;

        P = z2*z2 + z1*z1 - c * z1*z2
        Pxx.append(P)
    return np.array(Pxx)

def main():
    data = np.fromfile('../single_tone_v2.dat', dtype=np.int32)
    data = data>>14
    print(time.time())
    yjit = sg_jit(data, k=100)
    yjit = sg_jit(data, k=100)
    print(time.time())
    yjit.tofile('sg2.out')
    y = sg(data, k=100)
     
    print('where different', np.where(y-yjit))
main()
