import cffi

ffi = cffi.FFI()
ffi.cdef("""
        int add_int(int, int);
        float add_float(float, float);
        """)
adder = ffi.dlopen('./adder.so')
result = adder.add_int(4,5)
result_float = adder.add_float(4,5)

print("results should be 9...", result, result_float)
