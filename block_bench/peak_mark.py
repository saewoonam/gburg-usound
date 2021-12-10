import numpy as np
from numba import jit

@jit
def peak_marking_v2(y, lag, threshold, influence, width, mph, signals): #, filteredY):
    filteredY = np.zeros(int(lag))
    avgFilter = 0
    stdFilter = 0
    std2 = stdFilter**2
    pks = []
    start, length, pk, pk_idx = -1, 0, -1, -1
    #print('len(y)', len(y))
    i=0
    #for i in range(0, len(y)):
    while i<len(y):
        # if i == lag:
        #     print(avgFilter, stdFilter)
        oldValue = filteredY[i%lag] # store this for use to update mean and std
        if abs(y[i] - avgFilter) > threshold * stdFilter and (i>=lag):
            if (y[i] > avgFilter):
                signals[i] = 1
                if start<0:
                    start, length = i, 1
                    #print(start)
                else:
                    #print(i, start, length)
                    length += 1
                if y[i]>pk:
                    pk, pk_idx = y[i], i
            else:
                signals[i] = -1
                if (start>0) and (length>width) and (pk>mph):
                    pks.append([start, length, pk_idx, pk])
                    # print("-1", i, start, length, pk_idx, pk)
                    start, length, pk, pk_idx = -1, 0, -1, -1
            filteredY[i%lag] = influence * y[i] + (1 - influence) * filteredY[(i-1)%lag]
        else:
            signals[i] = 0
            filteredY[i%lag] = y[i]
            if (start>0) and (length>width) and (pk>mph):
                pks.append([start, length, pk_idx, pk])
                # print("0:", i, start, length, pk, pk_idx)
            start, length, pk, pk_idx = -1, 0, -1, -1
        prevAvg = avgFilter
        avgFilter = avgFilter + (filteredY[i%lag] - oldValue) / lag
        #print(prevAvg, avgFilter, filteredY[i%lag], oldValue)
        # avgFilter = np.mean(filteredY)
        std2 = std2 + (filteredY[i%lag] - oldValue)*(filteredY[i%lag] + oldValue - avgFilter - prevAvg) /lag
        stdFilter = std2**0.5
        #stdFilter = np.std(filteredY)
        i += 1
    return pks



def pk_mark(y, lag, threshold, influence, width, mph):
    """Find and mark peaks using z-scor algorithm
    
    Returns:  pks, signals
    pks -- list of peaks... [start, length, pk_idx, pk]
    signals -- numpy array that is the length of the input.  
            1 if in + peak, -1 in - peak, 0 not in peak
            
    Keyword arguments:
    y -- numpy array of input signal
    lag -- integer of how many points to compute mean and std over
    threshold -- double: multiples of std deviation that constitute a peak
    influence -- double: amount signal in the peak influences the running avg and std
    width -- integer:  minimum peak width to be added to the output
    mph: double: minimum peak hieght
    """
    signals = np.zeros(len(y))
    #filteredY = np.zeros(int(lag))
    pks = peak_marking_v2(y, int(lag), threshold, influence, width, mph, signals)
    return pks, signals


@jit
def peak_marking_block(y, yLen, filteredY, settings, state, signals): #, filteredY):
    lag = settings.lag

    avgFilter = state.avgFilter
    std2 = state.std2
    stdFilter = state.std2**0.5
    pks = []
    # start, length, pk, pk_idx = -1, 0, -1, -1
    write_addr = state.write_addr
    time_between = state.time_between
    length = state.length
    pk = state.pk
    pk_idx = state.pk_idx
    pk_time = state.pk_time
    #print(write_addr, length, pk, pk_idx)
    for i in range(yLen):
        # if (i%64) == 0:
        #    print(avgFilter, stdFilter)
        write_addr += 1
        time_between += 1
        
        idx = write_addr % lag
        prev_idx = (write_addr -1 + lag) % lag
        
        oldValue = filteredY[idx] # store this for use to update mean and std

        if abs(y[i] - avgFilter) > settings.threshold * stdFilter and (write_addr>=lag):
            if (y[i] > avgFilter):
                signals[i] = 1
                #if start<0:
                if length==0:
                    start, length = i, 1
                    #print(start)
                else:
                    #print(i, start, length)
                    length += 1
                if y[i]>pk:
                    pk, pk_idx = y[i], i
                    pk_time = time_between
            else:
                signals[i] = -1
                if (length>0) and (length>settings.width) and (pk>settings.mph):
                    # pks.append([start, length, pk_idx, pk, pk_time])
                    pks.append([pk_time, length, pk])
                    print("-1", i, start, length, pk_idx, pk)
                    start, length, pk, pk_idx = -1, 0, -1, -1
                    time_between = time_between - pk_time
            filteredY[idx] = settings.influence * y[i] + (1 - settings.influence) * filteredY[prev_idx]
        else:
            signals[i] = 0
            filteredY[idx] = y[i]
            if (length>0) and (length>settings.width) and (pk>settings.mph):
                #pks.append([start, length, pk_idx, pk, pk_time])
                pks.append([pk_time, length, pk])
                #print("0:", i, start, length, pk, pk_idx, time_between, pk_time)
                time_between = time_between - pk_time 
            start, length, pk, pk_idx = -1, 0, -1, -1
        prevAvg = avgFilter
        avgFilter = avgFilter + (filteredY[idx] - oldValue) / lag
        #print(prevAvg, avgFilter, filteredY[i%lag], oldValue)
        # avgFilter = np.mean(filteredY)
        std2 = std2 + (filteredY[idx] - oldValue)*(filteredY[idx] + oldValue - avgFilter - prevAvg) /lag
        stdFilter = std2**0.5
        #stdFilter = np.std(filteredY)
    state.std2 = std2
    state.avgFilter = avgFilter
    state.write_addr = write_addr
    state.time_between = time_between
    state.length = length
    state.pk = pk
    state.pk_idx = pk_idx
    state.pk_time = pk_time

    return pks

@jit
def pk_mark_block(y, settings, state):
    """Find and mark peaks using z-scor algorithm
    
    Returns:  pks, signals
    pks -- list of peaks... [start, length, pk_idx, pk]
    signals -- numpy array that is the length of the input.  
            1 if in + peak, -1 in - peak, 0 not in peak
            
    Keyword arguments:
    y -- numpy array of input signal
    settings -- numpy record structure with parameters for identifying peaks
    state -- numpy record structure that stores the state of peak finding between blocks of data
    """
    signals = np.zeros(len(y))
    filteredY = np.zeros(settings.lag)
    pks = peak_marking_block(y, len(y), filteredY, settings, state, signals)
    print(state)
    return pks, signals

dt_settings = np.dtype([('lag', 'i4'), ('width', 'i4'), 
                        ('threshold', 'f8'), ('influence', 'f8'), ('mph', 'f8')
                       ])

dt_state = np.dtype([
                    ('avgFilter', 'f8'), ('std2', 'f8'),
                    ('write_addr', 'i4'), ('time_between', 'i4'),
                    ('length', 'i4'), ('pk_idx', 'i4'),
                    ('pk', 'f8'),
                    ('pk_time', 'i4'),
                   ])
