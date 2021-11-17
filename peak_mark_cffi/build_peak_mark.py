from cffi import FFI
import time
import numpy as np
import matplotlib.pyplot as plt
from numba import jit


# In[2]:


ffibuilder = FFI()
ffibuilder.set_source("_peak_find",
   r""" // passed to the real C compiler,
        // contains implementation of things declared in cdef()
        #include <math.h>
        #include "peak_mark.h"
    """,
    sources=['peak_mark.c'],                 
    libraries=['m'])   # or a list of libraries to link with
    # (more arguments like setup.py's Extension class:
    # include_dirs=[..], extra_objects=[..], and so on)


fd = open("peak_mark.h",'r')
cdefs = fd.read()
fd.close()

# cdef() expects a single string declaring the C types, functions and
# globals needed to use the shared object. It must be in valid C syntax.
ffibuilder.cdef(cdefs)



ffibuilder.compile(verbose=True)


