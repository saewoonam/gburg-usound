from cffi import FFI
import time
import numpy as np
import matplotlib.pyplot as plt
from numba import jit

import build_peak_mark

from _peak_find import ffi, lib

filename = '/Users/nams/Downloads/Fulldata_initiator_19delay.dat'
data = np.loadtxt(filename, delimiter=',').flatten()


# Sliding Goertzel
@jit
def sg_v2(x, k=25*4):
    Pxx = []
    N = 64*4
    w = 2*np.pi*k/N;
    cw = np.cos(w);
    c = 2*cw;
    sw = np.sin(w);
    z1=0;
    z2=0;
    #while (idx < (len(x)-1)):
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


# In[11]:


y = sg_v2(data, k=100)


# In[12]:

settings = ffi.new("settings_t *")
history = ffi.new("history_t *")

settings.lag = 256
settings.width = 10
settings.threshold = 5
settings.influence = 1e-4
history.start = -1
history.pkidx = -1
history.length = 0
history.pk = -1
history.avg = 0
history.std2 = 0
history.time_since_pk = -1
history.time_pk = -1
history.init = 0

x = y.astype(np.double)
x_p = ffi.cast('double *', x.ctypes.data)
N = len(x)
signals = np.zeros(len(y));
signals_p = ffi.cast('double *', signals.ctypes.data)
filteredY = np.zeros(settings.lag);
filteredY_p = ffi.cast('double *', filteredY.ctypes.data)
debug = np.zeros(len(y));
debug_p = ffi.cast('double *', debug.ctypes.data)


r = []
# print(N, N>>6)
start = time.time()
for count in range(N>>6):
    #  Load only 64 bytes at a time... offset x by count*64
    x_p = ffi.cast('double *', x[count*64:].ctypes.data)
    #  setup signals to put the results in the right place
    signals_p = ffi.cast('double *', signals[count*64:].ctypes.data)
    #  process only 64 points
    last = lib.peakMark(x_p, 64, settings, history, filteredY_p, signals_p, debug_p)
    if (last != ffi.NULL):
        r.append([last.start, last.length, last.pk_idx, last.pk_time, last.pk])
        lib.free_results(last)
    # print(count)
print("elapsed time: ", time.time()-start)
print(np.array(r, dtype=int))
