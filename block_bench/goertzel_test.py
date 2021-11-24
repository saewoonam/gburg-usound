from cffi import FFI
import time
import numpy as np
from numba import jit

# Numba code to calculate sliding goertzel with updates to data

# Sliding Goertzel block


@jit
def sg_block_v1(x, offset, z, Pxx, c, block_size=64, k=25*4, window_size=64*4):
    z1, z2 = z
    for idx in range(block_size):
        z0 = x[offset + idx] - x[offset + idx-window_size] + c*z1 - z2
        z2 = z1
        z1 = z0

        Pxx[idx] = z2*z2 + z1*z1 - c * z1*z2
    z[0] = z1
    z[1] = z2


@jit
def sg_block_v2(x, offset, z, Pxx, c, block_size, window_size):
    z1, z2 = z
    for idx in range(block_size):
        z0 = x[offset + idx] - x[offset + idx-window_size] + c*z1 -z2;
        z2 = z1;
        z1 = z0;
        Pxx[idx] = z2*z2 + z1*z1 - c * z1*z2
    z[0] = z1
    z[1] = z2

@jit
def sg_z(x, k):
    Z = []
    N = 64*4
    w = 2*np.pi*k/N;
    cw = np.cos(w);
    c = 2*cw;
    sw = np.sin(w);
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
        I = cw*z1 -z2;
        Q = sw*z1;

        Z.append(I + 1j*Q)
    return np.array(Z)

#  C library to calculate sliding goertzel

def build_clib():
    ffibuilder = FFI()

    ffibuilder.set_source("_goertzel",
       r""" // passed to the real C compiler,
            // contains implementation of things declared in cdef()
            #include <math.h>

            // We can also define custom wrappers or other functions
            // here (this is an example only):
            double test_cos(double x) {
                return cos(x);
            }
            #define RING_SIZE 512
            
            void sg_block(int32_t *x, int offset, double* z, double *Pxx, double c) {
                int block_size = 64;
                int window_size = 256; 
                // Do index math just once... 
                int32_t *curr = x+offset;
                int32_t *past = x + ((offset - window_size) & (RING_SIZE-1));
                double z0;
                double z1 = z[0];
                double z2 = z[1];
                
                for (int idx=0; idx<block_size; idx++) {
                    // z0 = x[offset + idx] - x[((offset + idx - window_size)&(512-1))] + c*z1 - z2;
                    z0 = *curr++ - *past++ + c*z1 - z2;
                    z2 = z1;
                    z1 = z0;
                    Pxx[idx] = z2*z2 + z1*z1 - c * z1*z2;
                }
                z[0] = z1;
                z[1] = z2;
            }
        """,
        libraries=['m'])   # or a list of libraries to link with
        # (more arguments like setup.py's Extension class:
        # include_dirs=[..], extra_objects=[..], and so on)

    ffibuilder.cdef("""
        // declarations that are shared between Python and C
        double test_cos(double x);
        void sg_block(int32_t *x, int offset, double* z, double *Pxx, double c);
    """)


    ffibuilder.compile(verbose=True)


# Code to benchmark time to execute code

# import compiled c library... used CFFI in API mode
try:
    import _goertzel
except ImportError:
    build_clib()
    import _goertzel

if __name__ == '__main__':
    #  Load data into a binary array
    raw = np.fromfile('../mic_data/single_tone_v2.dat', dtype=np.int32)

    # Calculate parameters for the goertzel algorithm
    k=100; window_size=256
    w = 2*np.pi*k/window_size;
    c = 2*np.cos(w);


    for loop in range(10):

        # Allocated all memory needed to run algorithm
        z = np.zeros(2)
        ring = np.zeros(512, np.int32)
        result = np.zeros(1280000)

        # Get pointers to the addresses in memory for the output and results
        ptr_ring = _goertzel.ffi.cast("int32_t *", ring.ctypes.data)
        ptr_z = _goertzel.ffi.cast("double *", z.ctypes.data)
        # ptr_Pxx = _goertzel.ffi.cast("double *", Pxx.ctypes.data)

        # Point to the beginning of the ring buffer
        write_addr = 0
            
        start = time.time()
        for count in range(int(len(raw)/64)):
            ring[(write_addr):(write_addr+64)] = raw[ (count*64):((count+1)*64)]>>14
            # Uncomment next two lines to call c library with cffi
            # ptr_Pxx = _goertzel.ffi.cast("double *", result[(count*64):].ctypes.data)
            # _goertzel.lib.sg_block(ptr_ring, write_addr, ptr_z, ptr_Pxx, c) 
            # Uncomment next line and one of the three lines afterwards to try numba
            Pxx = result[(count*64):((count+1)*64)] 
            # sg_block_v2(ring, write_addr, z, Pxx, c, 64, 256)
            # sg_block_v1(ring, write_addr, z, Pxx, c, 64, 256)
            sg_block_v1(ring, write_addr, z, Pxx, c)
            write_addr += 64
            write_addr &= (512-1)
        print(time.time()-start)


